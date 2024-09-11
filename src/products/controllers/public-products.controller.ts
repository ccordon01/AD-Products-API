import { Controller, Delete, Get, Param, Post, Query } from '@nestjs/common';
import { ProductsService } from '../products.service';
import { ApiTags } from '@nestjs/swagger';
import { FilterProductsDto } from '../dto/filter-products.dto';
import { ResponseFilterProductsDto } from '../dto/response-filter-products.dto';

@ApiTags('Public')
@Controller('products')
export class PublicProductsController {
  constructor(private productsService: ProductsService) {}

  @Post('fetch')
  fetchAndSaveProducts(): Promise<void> {
    return this.productsService.fetchAndSaveProducts();
  }

  @Get()
  findFilteredProducts(
    @Query() filterProductsDto: FilterProductsDto,
  ): Promise<ResponseFilterProductsDto> {
    return this.productsService.findFilteredProducts(filterProductsDto);
  }

  @Delete(':productSku')
  deleteProduct(@Param('productSku') productSku: string): Promise<void> {
    return this.productsService.deleteProduct(productSku);
  }
}
