import { IProducts } from '../../interfaces/products.interface';
import { Product } from '../../repository/schemas/product.schema';

export function productsRepositoryMapper(products: Product[]): IProducts[] {
  if (!(Array.isArray(products) && products.length)) {
    return [];
  }

  return products.map((product) => ({
    productSku: product.productSku,
    productName: product.productName,
    productBrand: product.productBrand,
    productModel: product.productModel,
    productCategory: product.productCategory,
    productColor: product.productColor,
    productPrice: product.productPrice,
    productCurrency: product.productCurrency,
    productStock: product.productStock,
  }));
}
