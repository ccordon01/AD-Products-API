import { IProducts } from '../interfaces/products.interface';

export class ResponseFilterProductsDto {
  data: ProductsDto[];
  meta: {
    totalItems: number;
    totalPages: number;
    currentPage: number;
    pageSize: number;
  };
}

class ProductsDto implements IProducts {
  productSku: string;
  productName: string;
  productBrand: string;
  productModel: string;
  productCategory: string;
  productColor: string;
  productPrice: number;
  productCurrency: string;
  productStock: number;
  productCreatedAt: Date;
}
