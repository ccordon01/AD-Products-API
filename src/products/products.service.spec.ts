import { Test, TestingModule } from '@nestjs/testing';
import { ProductsService } from './products.service';
import { ProductsRepository } from './repository/products.repository';
import { ApiClientService } from '../api-client/api-client.service';

describe('ProductsService', () => {
  let service: ProductsService;
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

    service = module.get<ProductsService>(ProductsService);
    productsRepository = module.get<ProductsRepository>(ProductsRepository);
    apiClientService = module.get<ApiClientService>(ApiClientService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
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
    await service.fetchAndSaveProducts();

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
});
