import { Controller, Get } from '@nestjs/common';
import { ProductsService } from '../products.service';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('Internal')
@Controller('products')
export class InternalProductsController {
  constructor(private productsService: ProductsService) {}

  @Get('deleted-percentage')
  percentageDeletedProducts() {
    return this.productsService.percentageDeletedProducts();
  }
}
