import {
  BadRequestException,
  ConflictException,
  HttpException,
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { ProductsRepository } from './repository/products.repository';
import { ApiClientService } from '../api-client/api-client.service';
import { FilterProductsDto } from './dto/filter-products.dto';
import { productsRepositoryMapper } from './helpers/mappers/products-repository.mapper';
import { ResponseFilterProductsDto } from './dto/response-filter-products.dto';
import { DeletedProductsRepository } from './repository/deleted-products.repository';
import { ResponseDeletedProductsPercentageDto } from './dto/response-deleted-products-percentage.dto';
import { Cron, CronExpression } from '@nestjs/schedule';
import { NonDeletedProductsReportDto } from './dto/count-products-for-non-deleted-products-report.dto';
import { ResponseNonDeletedProductsPercentageDto } from './dto/response-non-deleted-products-percentage.dto';
import { startOfDayUTC } from '../utils/start-of-day-utc';
import { endOfDayUTC } from '../utils/end-of-day-utc';

@Injectable()
export class ProductsService {
  private readonly logger = new Logger(ProductsService.name);

  constructor(
    private apiClientService: ApiClientService,
    private productsRepository: ProductsRepository,
    private deletedProductsRepository: DeletedProductsRepository,
  ) {}

  async fetchAndSaveProducts(): Promise<void> {
    const productsFromApi = await this.apiClientService.fetchProducts();
    const deletedProducts =
      await this.deletedProductsRepository.findAllDeletedProducts();
    const deletedProductSkus = deletedProducts.map(
      (product) => product.productSku,
    );

    const newProducts = productsFromApi?.items.reduce(
      (acc, { fields: product }) => {
        const productSku = product.sku;
        if (!deletedProductSkus.includes(productSku)) {
          acc.push({
            productSku,
            productName: product.name,
            productBrand: product.brand,
            productModel: product.model,
            productCategory: product.category,
            productColor: product.color,
            productPrice: product.price,
            productCurrency: product.currency,
            productStock: product.stock,
          });
        }
        return acc;
      },
      [],
    );

    await this.productsRepository.createProducts(newProducts);
  }

  @Cron(CronExpression.EVERY_HOUR)
  async fetchAndSaveProductsHourly() {
    this.logger.log('Initiating Product Synchronization.');
    try {
      await this.fetchAndSaveProducts();
    } catch (error) {
      this.logger.error(`Error fetching and saving products: ${error.message}`);
    }
  }

  async findFilteredProducts(
    filterProductsDto: FilterProductsDto,
  ): Promise<ResponseFilterProductsDto> {
    const { skip, limit } = filterProductsDto;

    const excludeProductSkus =
      await this.deletedProductsRepository.findAllDeletedProducts();
    const { totalCount, products: _products } =
      await this.productsRepository.findFilteredProducts(
        filterProductsDto,
        excludeProductSkus?.map((product) => product.productSku),
      );

    const products = productsRepositoryMapper(_products);

    const totalPages = Math.ceil(totalCount / limit);
    const currentPage = skip / limit + 1;
    return {
      data: products,
      meta: {
        totalItems: totalCount,
        totalPages,
        currentPage,
        pageSize: products.length,
      },
    };
  }

  async deleteProduct(productSku: string): Promise<void> {
    try {
      const deletedProduct =
        await this.deletedProductsRepository.findDeletedProductByProductSku(
          productSku,
        );

      if (deletedProduct) {
        throw new ConflictException('Product already deleted.');
      }

      const product =
        await this.productsRepository.findProductByProductSku(productSku);

      if (!product) {
        throw new NotFoundException('Product not found.');
      }

      await this.deletedProductsRepository.createDeletedProduct(productSku);
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      } else {
        this.logger.error('Error deleting product:', error);
        throw new InternalServerErrorException(
          'An error occurred while deleting the product.',
        );
      }
    }
  }

  async percentageDeletedProducts(): Promise<ResponseDeletedProductsPercentageDto> {
    try {
      const deletedProducts =
        await this.deletedProductsRepository.findAllDeletedProducts();
      const totalDeletedProducts =
        await this.productsRepository.countProductsByProductSku(
          deletedProducts.map((product) => product.productSku),
        );
      const totalProducts = await this.productsRepository.countProducts();

      const totalUniqueProductSkus =
        await this.productsRepository.countAllUniqueProductSkus();

      let percentageDeletedProducts = 0;
      let percentageUniqueDeletedProducts = 0;

      if (totalProducts > 0) {
        percentageDeletedProducts =
          (totalDeletedProducts / totalProducts) * 100;
      }

      if (totalUniqueProductSkus > 0) {
        percentageUniqueDeletedProducts =
          (deletedProducts.length / totalUniqueProductSkus) * 100;
      }

      return {
        data: {
          totalDeletedProducts,
          totalProducts,
          totalUniqueDeletedProduct: deletedProducts.length,
          totalUniqueProductSkus,
        },
        deletedProductsPercentage: {
          percentageDeletedProducts: `${percentageDeletedProducts.toFixed(2)}%`,
          percentageUniqueDeletedProducts: `${percentageUniqueDeletedProducts.toFixed(
            2,
          )}%`,
        },
      };
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      } else {
        this.logger.error('Error generating deleted products report:', error);
        throw new InternalServerErrorException(
          'An error occurred while generating deleted products report.',
        );
      }
    }
  }

  async percentageNonDeletedProducts(
    nonDeletedProductsReportDto: NonDeletedProductsReportDto,
  ): Promise<ResponseNonDeletedProductsPercentageDto> {
    try {
      const {
        productWithPrice,
        productCreatedAtEndDate,
        productCreatedAtStartDate,
      } = nonDeletedProductsReportDto;

      if (
        (productCreatedAtStartDate && !productCreatedAtEndDate) ||
        (!productCreatedAtStartDate && productCreatedAtEndDate)
      ) {
        throw new BadRequestException(
          'Both start and end dates must be provided together',
        );
      }

      if (productCreatedAtStartDate > productCreatedAtEndDate) {
        throw new BadRequestException(
          'Start date cannot be greater than end date.',
        );
      }

      const deletedProducts =
        await this.deletedProductsRepository.findAllDeletedProducts();

      const totalNonDeletedProducts =
        await this.productsRepository.countProductsForNonDeletedProductsReport({
          productWithPrice: productWithPrice ?? true,
          productCreatedAtStartDate: startOfDayUTC(productCreatedAtStartDate),
          productCreatedAtEndDate: endOfDayUTC(productCreatedAtEndDate),
          excludeProductSkus: deletedProducts.map(
            (product) => product.productSku,
          ),
        });

      const totalProducts = await this.productsRepository.countProducts();

      let percentageNonDeletedProducts = 0;

      if (totalProducts > 0) {
        percentageNonDeletedProducts =
          (totalNonDeletedProducts / totalProducts) * 100;
      }

      return {
        data: {
          totalNonDeletedProducts,
          totalProducts,
        },
        deletedNonProductsPercentage: {
          percentageNonDeletedProducts: `${percentageNonDeletedProducts.toFixed(2)}%`,
        },
      };
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      } else {
        this.logger.error(
          'Error generating non-deleted products report:',
          error,
        );
        throw new InternalServerErrorException(
          'An error occurred while generating non-deleted products report.',
        );
      }
    }
  }

  async totalProductsByProductBrand() {
    try {
      const totalProductsByProductBrand =
        await this.productsRepository.totalProductsByProductBrand();
      const totalProducts = await this.productsRepository.countProducts();

      return {
        data: {
          totalProducts,
        },
        totalProductsByProductBrand: totalProductsByProductBrand.map(
          (brand) => ({
            productBrand: brand.productBrand,
            totalProducts: brand.count,
          }),
        ),
      };
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      } else {
        this.logger.error('Error fetching product brand report:', error);
        throw new InternalServerErrorException(
          'An error occurred while fetching product brand report.',
        );
      }
    }
  }
}
