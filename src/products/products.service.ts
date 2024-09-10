import {
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
    await this.productsRepository.createProducts(
      productsFromApi?.items.map(({ fields: product }) => ({
        productSku: product.sku,
        productName: product.name,
        productBrand: product.brand,
        productModel: product.model,
        productCategory: product.category,
        productColor: product.color,
        productPrice: product.price,
        productCurrency: product.currency,
        productStock: product.stock,
      })),
    );
  }

  async findFilteredProducts(
    filterProductsDto: FilterProductsDto,
  ): Promise<ResponseFilterProductsDto> {
    const { skip, limit } = filterProductsDto;
    const { totalCount, products: _products } =
      await this.productsRepository.findFilteredProducts(filterProductsDto);

    const products = productsRepositoryMapper(_products);

    const totalPages = Math.ceil(totalCount / limit);
    const currentPage = skip / limit + 1;
    return {
      data: products,
      meta: {
        totalItems: totalCount,
        totalPages,
        currentPage,
        pageSize: limit,
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
}
