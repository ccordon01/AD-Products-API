import { Controller, Get, Query } from '@nestjs/common';
import { ProductsService } from '../products.service';
import { ApiTags } from '@nestjs/swagger';
import { ResponseDeletedProductsPercentageDto } from '../dto/response-deleted-products-percentage.dto';
import { NonDeletedProductsReportDto } from '../dto/count-products-for-non-deleted-products-report.dto';
import { ResponseNonDeletedProductsPercentageDto } from '../dto/response-non-deleted-products-percentage.dto';

@ApiTags('Internal')
@Controller('products')
export class InternalProductsController {
  constructor(private productsService: ProductsService) {}

  @Get('deleted-percentage')
  percentageDeletedProducts(): Promise<ResponseDeletedProductsPercentageDto> {
    return this.productsService.percentageDeletedProducts();
  }

  @Get('non-deleted-percentage')
  percentageNonDeletedProducts(
    @Query()
    nonDeletedProductsReportDto: NonDeletedProductsReportDto,
  ): Promise<ResponseNonDeletedProductsPercentageDto> {
    return this.productsService.percentageNonDeletedProducts(
      nonDeletedProductsReportDto,
    );
  }
}
