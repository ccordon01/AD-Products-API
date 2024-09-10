import { FilterProductsDto } from '../dto/filter-products.dto';
import { ProductsRepository } from './products.repository';
import { Product } from './schemas/product.schema';
import { Model } from 'mongoose';

describe('findFilteredProducts method', () => {
  let productModel: jest.Mocked<Model<Product>>;
  let productsRepository: ProductsRepository;

  beforeEach(() => {
    // Mock del modelo de Mongoose con exec()
    productModel = {
      find: jest.fn().mockReturnValue({
        skip: jest.fn().mockReturnThis(),
        limit: jest.fn().mockReturnThis(),
        exec: jest.fn(),
      }),
      countDocuments: jest.fn().mockReturnValue({
        exec: jest.fn(),
      }),
    } as unknown as jest.Mocked<Model<Product>>;

    // Proporcionar el mock al repositorio
    productsRepository = new ProductsRepository(productModel);
  });

  it('should return all products when no filter is provided', async () => {
    const filterProductsDto: FilterProductsDto = {
      skip: 0,
      limit: 10,
    };

    const mockProducts = [
      {
        productSku: '12345',
        productName: 'Test Product',
        productBrand: 'Test Brand',
        productModel: 'Test Model',
        productCategory: 'Test Category',
        productColor: 'Test Color',
        productPrice: 100,
        productCurrency: 'USD',
        productStock: 10,
      },
    ];

    (productModel.find().exec as jest.Mock).mockResolvedValue(mockProducts);
    (productModel.countDocuments().exec as jest.Mock).mockResolvedValue(
      mockProducts.length,
    );

    const result =
      await productsRepository.findFilteredProducts(filterProductsDto);

    expect(result.totalCount).toEqual(mockProducts.length);
    expect(result.products).toEqual(mockProducts);
  });

  it('should apply filters and return filtered products', async () => {
    const filterProductsDto: FilterProductsDto = {
      skip: 0,
      limit: 10,
      productName: 'Test Product',
      productMinPrice: 50,
      productMaxPrice: 150,
      productCurrency: 'USD',
      productMinStock: 5,
      productMaxStock: 15,
    };

    const mockFilteredProducts = [
      {
        productSku: '12345',
        productName: 'Test Product',
        productBrand: 'Test Brand',
        productModel: 'Test Model',
        productCategory: 'Test Category',
        productColor: 'Test Color',
        productPrice: 100,
        productCurrency: 'USD',
        productStock: 10,
      },
    ];

    (productModel.find().exec as jest.Mock).mockResolvedValue(
      mockFilteredProducts,
    );
    (productModel.countDocuments().exec as jest.Mock).mockResolvedValue(
      mockFilteredProducts.length,
    );

    const result =
      await productsRepository.findFilteredProducts(filterProductsDto);

    expect(result.totalCount).toEqual(mockFilteredProducts.length);
    expect(result.products).toEqual(mockFilteredProducts);
  });
});
