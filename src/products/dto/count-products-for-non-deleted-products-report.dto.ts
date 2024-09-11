import { IsBoolean, IsDateString, IsOptional } from 'class-validator';
import { INonDeletedProducts } from '../interfaces/non-deleted-products.interface';
import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';

export class CountProductsForNonDeletedProductsReportRepositoryDto
  implements INonDeletedProducts
{
  productWithPrice?: boolean;
  productCreatedAtStartDate?: Date;
  productCreatedAtEndDate?: Date;
  excludeProductSkus?: string[];
}

export class NonDeletedProductsReportDto implements INonDeletedProducts {
  @IsOptional()
  @IsBoolean()
  @Transform(({ value }) =>
    value === 'true' ? true : value === 'false' ? false : value,
  )
  @ApiProperty({ default: true })
  productWithPrice?: boolean;

  @IsOptional()
  @IsDateString()
  productCreatedAtStartDate?: Date;

  @IsOptional()
  @IsDateString()
  productCreatedAtEndDate?: Date;
}
