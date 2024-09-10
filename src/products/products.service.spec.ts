import { Test, TestingModule } from '@nestjs/testing';
import { ProductsService } from './products.service';
import { ProductsRepository } from './repository/products.repository';
import { ApiClientService } from '../api-client/api-client.service';
import { FilterProductsDto } from './dto/filter-products.dto';
import { DeletedProductsRepository } from './repository/deleted-products.repository';

describe('ProductsService', () => {
  let productsService: ProductsService;
  let productsRepository: ProductsRepository;
  let apiClientService: ApiClientService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ProductsService,
        {
          provide: ProductsRepository,
          useValue: {
            createProducts: jest.fn(),
            findFilteredProducts: jest.fn(),
          },
        },
        {
          provide: DeletedProductsRepository,
          useValue: {
            createDeletedProduct: jest.fn(),
            findDeletedProductByProductSku: jest.fn(),
          },
        },
        {
          provide: ApiClientService,
          useValue: {
            fetchProducts: jest.fn(),
          },
        },
      ],
    }).compile();

    productsService = module.get<ProductsService>(ProductsService);
    productsRepository = module.get<ProductsRepository>(ProductsRepository);
    apiClientService = module.get<ApiClientService>(ApiClientService);
  });

  it('should be defined', () => {
    expect(productsService).toBeDefined();
  });

  it('should fetch and save products correctly when the API returns valid data', async () => {
    const mockProducts = [
      {
        fields: {
          sku: '12345',
          name: 'Test Product',
          brand: 'Test Brand',
          model: 'Test Model',
          category: 'Test Category',
          color: 'Test Color',
          price: 100,
          currency: 'USD',
          stock: 10,
        },
      },
    ];

    (apiClientService.fetchProducts as jest.Mock).mockResolvedValue({
      items: mockProducts,
    });
    await productsService.fetchAndSaveProducts();

    expect(productsRepository.createProducts).toHaveBeenCalledWith([
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
    ]);
  });

  it('should return products correctly', async () => {
    const filterProductsDto: FilterProductsDto = {
      skip: 0,
      limit: 10,
      productBrand: 'Test Brand',
      productCategory: 'Test Category',
    };

    (productsRepository.findFilteredProducts as jest.Mock).mockResolvedValue({
      totalCount: 10,
      products: [
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
      ],
    });

    const result =
      await productsService.findFilteredProducts(filterProductsDto);

    expect(result).toEqual({
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
        },
      ],
      meta: {
        totalItems: 10,
        totalPages: 1,
        currentPage: 1,
        pageSize: 10,
      },
    });
  });
});
