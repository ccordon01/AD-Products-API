import { Controller, Post } from '@nestjs/common';
import { ProductsService } from './products.service';

@Controller('products')
export class ProductsController {
  constructor(private productsService: ProductsService) {}

  @Post('fetch')
  fetchAndSaveProducts(): Promise<void> {
    return this.productsService.fetchAndSaveProducts();
  }
}
