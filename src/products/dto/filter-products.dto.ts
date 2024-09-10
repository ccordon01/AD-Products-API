import { IsOptional, IsString, Min } from 'class-validator';
import { PaginationDto } from '../../shared/dto/pagination.dto';

export class FilterProductsDto extends PaginationDto {
  @IsOptional()
  @IsString()
  productSku?: string;

  @IsOptional()
  @IsString()
  productName?: string;

  @IsOptional()
  @IsString()
  productBrand?: string;

  @IsOptional()
  @IsString()
  productModel?: string;

  @IsOptional()
  @IsString()
  productCategory?: string;

  @IsOptional()
  @IsString()
  productColor?: string;

  @IsOptional()
  @Min(0)
  productMinPrice?: number;

  @IsOptional()
  @Min(0)
  productMaxPrice?: number;

  @IsOptional()
  @IsString()
  productCurrency?: string;

  @IsOptional()
  @Min(0)
  productMinStock?: number;

  @IsOptional()
  @Min(0)
  productMaxStock?: number;
}
