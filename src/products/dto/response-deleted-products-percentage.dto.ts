export class ResponseDeletedProductsPercentageDto {
  data: {
    totalDeletedProducts: number;
    totalProducts: number;
    totalUniqueDeletedProduct: number;
    totalUniqueProductSkus: number;
  };
  deletedProductsPercentage: {
    percentageDeletedProducts: string;
    percentageUniqueDeletedProducts: string;
  };
}
