import { Injectable } from '@nestjs/common';
import { ProductsRepository } from './repository/products.repository';
import { ApiClientService } from '../api-client/api-client.service';
import { FilterProductsDto } from './dto/filter-products.dto';
import { productsRepositoryMapper } from './helpers/mappers/products-repository.mapper';
import { ResponseFilterProductsDto } from './dto/response-filter-products.dto';

@Injectable()
export class ProductsService {
  constructor(
    private productsRepository: ProductsRepository,
    private apiClientService: ApiClientService,
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
}
