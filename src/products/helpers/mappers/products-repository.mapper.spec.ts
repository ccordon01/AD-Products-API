import { IProducts } from 'src/products/interfaces/products.interface';
import { productsRepositoryMapper } from './products-repository.mapper';
import { Product } from '../../repository/schemas/product.schema';

describe('productsRepositoryMapper', () => {
  it('should return an empty array when the input is an empty array', () => {
    const input: Product[] = [];
    const expectedOutput: any[] = [];

    const result = productsRepositoryMapper(input);

    expect(result).toEqual(expectedOutput);
  });

  it('should return an array with multiple items when the input contains multiple valid products', () => {
    const productCreatedAt = new Date();

    const input: Partial<Product>[] = [
      {
        productSku: '12345',
        productName: 'Test Product 1',
        productBrand: 'Test Brand 1',
        productModel: 'Test Model 1',
        productCategory: 'Test Category 1',
        productColor: 'Test Color 1',
        productPrice: 100,
        productCurrency: 'USD',
        productStock: 10,
        productCreatedAt,
      },
      {
        productSku: '67890',
        productName: 'Test Product 2',
        productBrand: 'Test Brand 2',
        productModel: 'Test Model 2',
        productCategory: 'Test Category 2',
        productColor: 'Test Color 2',
        productPrice: 200,
        productCurrency: 'EUR',
        productStock: 5,
        productCreatedAt,
      },
    ];

    const expectedOutput: IProducts[] = [
      {
        productSku: '12345',
        productName: 'Test Product 1',
        productBrand: 'Test Brand 1',
        productModel: 'Test Model 1',
        productCategory: 'Test Category 1',
        productColor: 'Test Color 1',
        productPrice: 100,
        productCurrency: 'USD',
        productStock: 10,
        productCreatedAt,
      },
      {
        productSku: '67890',
        productName: 'Test Product 2',
        productBrand: 'Test Brand 2',
        productModel: 'Test Model 2',
        productCategory: 'Test Category 2',
        productColor: 'Test Color 2',
        productPrice: 200,
        productCurrency: 'EUR',
        productStock: 5,
        productCreatedAt,
      },
    ];

    const result = productsRepositoryMapper(input as Product[]);

    expect(result).toEqual(expectedOutput);
  });
});
