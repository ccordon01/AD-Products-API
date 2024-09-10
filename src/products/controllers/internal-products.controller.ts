import { Controller, Get } from '@nestjs/common';
import { ProductsService } from '../products.service';
import { ApiTags } from '@nestjs/swagger';
import { ResponseDeletedProductsPercentageDto } from '../dto/response-deleted-products-percentage.dto';

@ApiTags('Internal')
@Controller('products')
export class InternalProductsController {
  constructor(private productsService: ProductsService) {}

  @Get('deleted-percentage')
  percentageDeletedProducts(): Promise<ResponseDeletedProductsPercentageDto> {
    return this.productsService.percentageDeletedProducts();
  }
}
