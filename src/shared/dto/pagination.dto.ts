import { Type } from 'class-transformer';
import { IsInt, IsNotEmpty, Max, Min } from 'class-validator';

export class PaginationDto {
  @IsNotEmpty()
  @IsInt()
  @Min(0)
  @Type(() => Number)
  skip: number;

  @IsNotEmpty()
  @IsInt()
  @Min(1)
  @Max(5)
  @Type(() => Number)
  limit: number;
}
