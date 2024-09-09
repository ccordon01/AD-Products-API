import { Injectable } from '@nestjs/common';
import { ProductsRepository } from './repository/products.repository';
import { ApiClientService } from '../api-client/api-client.service';

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
}
