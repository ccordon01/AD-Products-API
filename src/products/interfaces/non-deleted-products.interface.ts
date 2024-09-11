export interface INonDeletedProducts {
  productWithPrice?: boolean;
  productCreatedAtStartDate?: Date;
  productCreatedAtEndDate?: Date;
  excludeProductSkus?: string[];
}
