export class ResponseTotalProductsByProductBrandDto {
  data: {
    totalProducts: number;
  };
  totalProductsByProductBrand: totalProductsByProductBrand[];
}

export class totalProductsByProductBrand {
  productBrand: string;
  totalProducts: number;
}
