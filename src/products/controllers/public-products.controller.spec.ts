import { Test, TestingModule } from '@nestjs/testing';
import { ProductsService } from '../products.service';
import { ProductsRepository } from '../repository/products.repository';
import { ApiClientService } from '../../api-client/api-client.service';
import { PublicProductsController } from './public-products.controller';
import { FilterProductsDto } from '../dto/filter-products.dto';
import { ResponseFilterProductsDto } from '../dto/response-filter-products.dto';

describe('PublicProductsController', () => {
  let productsService: ProductsService;
  let publicProductsController: PublicProductsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        {
          provide: ProductsService,
          useValue: {
            createProducts: jest.fn(),
            findFilteredProducts: jest.fn(),
            fetchAndSaveProducts: jest.fn().mockResolvedValue(null),
            deleteProduct: jest.fn().mockResolvedValue(null),
          },
        },
        {
          provide: ProductsRepository,
          useValue: {
            createProducts: jest.fn(),
          },
        },
        {
          provide: ApiClientService,
          useValue: {
            fetchProducts: jest.fn(),
          },
        },
      ],
      controllers: [PublicProductsController],
    }).compile();

    productsService = module.get<ProductsService>(ProductsService);
    publicProductsController = module.get<PublicProductsController>(
      PublicProductsController,
    );
  });

  it('should be defined', () => {
    expect(publicProductsController).toBeDefined();
  });

  it('should call fetchAndSaveProducts method from ProductsService', async () => {
    await publicProductsController.fetchAndSaveProducts();

    expect(productsService.fetchAndSaveProducts).toHaveBeenCalled();
  });

  it('should return an empty array when no products match the filter criteria', async () => {
    const mockFilterProductsDto: FilterProductsDto = {
      productBrand: 'Test Brand',
      productCategory: 'Test Category',
      productMinPrice: 100,
      productMaxPrice: 200,
      skip: 0,
      limit: 5,
    };

    (productsService.findFilteredProducts as jest.Mock).mockResolvedValue([]);

    const result = await publicProductsController.findFilteredProducts(
      mockFilterProductsDto,
    );

    expect(result).toEqual([]);
  });

  it('should return products correctly', async () => {
    const mockFilterProductsDto: FilterProductsDto = {
      productBrand: 'Test Brand',
      productCategory: 'Test Category',
      productMinPrice: 100,
      productMaxPrice: 200,
      skip: 0,
      limit: 5,
    };

    const mockResponseFilterProductsDto: ResponseFilterProductsDto = {
      data: [
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
          productCreatedAt: new Date(),
        },
      ],
      meta: { currentPage: 1, totalItems: 1, totalPages: 1, pageSize: 5 },
    };

    (productsService.findFilteredProducts as jest.Mock).mockResolvedValue(
      mockResponseFilterProductsDto,
    );

    const result = await publicProductsController.findFilteredProducts(
      mockFilterProductsDto,
    );

    expect(result).toEqual(mockResponseFilterProductsDto);
  });

  it('should return all products when no filter criteria are provided', async () => {
    const mockFilterProductsDto: FilterProductsDto = {
      skip: 0,
      limit: 5,
    };

    const mockResponseFilterProductsDto: ResponseFilterProductsDto = {
      data: [
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
          productCreatedAt: new Date(),
        },
        {
          productSku: '12346',
          productName: 'Test Product 2',
          productBrand: 'Test Brand 2',
          productModel: 'Test Model 2',
          productCategory: 'Test Category 2',
          productColor: 'Test Color 2',
          productPrice: 150,
          productCurrency: 'USD',
          productStock: 20,
          productCreatedAt: new Date(),
        },
        {
          productSku: '12347',
          productName: 'Test Product 3',
          productBrand: 'Test Brand 3',
          productModel: 'Test Model 3',
          productCategory: 'Test Category 3',
          productColor: 'Test Color 3',
          productPrice: 200,
          productCurrency: 'USD',
          productStock: 30,
          productCreatedAt: new Date(),
        },
        {
          productSku: '12348',
          productName: 'Test Product 4',
          productBrand: 'Test Brand 4',
          productModel: 'Test Model 4',
          productCategory: 'Test Category 4',
          productColor: 'Test Color 4',
          productPrice: 250,
          productCurrency: 'USD',
          productStock: 40,
          productCreatedAt: new Date(),
        },
        {
          productSku: '12349',
          productName: 'Test Product 5',
          productBrand: 'Test Brand 5',
          productModel: 'Test Model 5',
          productCategory: 'Test Category 5',
          productColor: 'Test Color 5',
          productPrice: 300,
          productCurrency: 'USD',
          productStock: 50,
          productCreatedAt: new Date(),
        },
      ],
      meta: { currentPage: 1, totalItems: 10, totalPages: 1, pageSize: 5 },
    };

    (productsService.findFilteredProducts as jest.Mock).mockResolvedValue(
      mockResponseFilterProductsDto,
    );

    const result = await publicProductsController.findFilteredProducts(
      mockFilterProductsDto,
    );

    expect(result).toEqual(mockResponseFilterProductsDto);
  });

  it('should delete a product successfully', async () => {
    const productSku = '12345';

    await publicProductsController.deleteProduct(productSku);

    expect(productsService.deleteProduct).toHaveBeenCalledWith(productSku);
    expect(productsService.deleteProduct).toHaveBeenCalledTimes(1);
  });
});
