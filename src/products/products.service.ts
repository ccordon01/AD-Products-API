import { Injectable } from '@nestjs/common';
import { ProductsRepository } from './repository/products.repository';
import { ApiClientService } from 'src/api-client/api-client.service';

@Injectable()
export class ProductsService {
  constructor(
    private productsRepository: ProductsRepository,
    private apiClientService: ApiClientService,
  ) {}

  async fetchAndSaveProducts(): Promise<void> {
    const productsFromApi = await this.apiClientService.fetchProducts();
    await this.productsRepository.createProducts(
      productsFromApi.map(({ }) => ({
        productSku: product.productSku,
        productName: product.productName,
        productBrand: product.productBrand,
        productPrice: product.productPrice,
      })),
    );
  }
}
