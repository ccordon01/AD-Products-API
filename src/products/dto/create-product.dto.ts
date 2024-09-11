export interface CreateProductDto {
  productSku: string;
  productName: string;
  productBrand: string;
  productModel?: string;
  productCategory?: string;
  productColor?: string;
  productPrice: number;
  productCurrency?: string;
  productStock?: number;
  productRemoved?: boolean;
}
