export class ResponseNonDeletedProductsPercentageDto {
  data: {
    totalNonDeletedProducts: number;
    totalProducts: number;
  };
  deletedNonProductsPercentage: {
    percentageNonDeletedProducts: string;
  };
}
