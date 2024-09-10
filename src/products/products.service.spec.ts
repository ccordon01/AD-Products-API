import { Test, TestingModule } from '@nestjs/testing';
import { ProductsService } from './products.service';
import { ProductsRepository } from './repository/products.repository';
import { ApiClientService } from '../api-client/api-client.service';
import { FilterProductsDto } from './dto/filter-products.dto';
import { DeletedProductsRepository } from './repository/deleted-products.repository';
import {
  ConflictException,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';

describe('ProductsService', () => {
  let productsService: ProductsService;
  let productsRepository: ProductsRepository;
  let deletedProductsRepository: DeletedProductsRepository;
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
            findProductByProductSku: jest.fn(),
          },
        },
        {
          provide: DeletedProductsRepository,
          useValue: {
            findAllDeletedProducts: jest.fn(),
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
    deletedProductsRepository = module.get<DeletedProductsRepository>(
      DeletedProductsRepository,
    );
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
        pageSize: 1,
      },
    });
  });

  it('should throw an error when trying to delete a product that does not exist', async () => {
    const productSku = 'nonexistentProduct';

    (productsRepository.findProductByProductSku as jest.Mock).mockResolvedValue(
      null,
    );

    (
      deletedProductsRepository.findDeletedProductByProductSku as jest.Mock
    ).mockResolvedValue(null);

    await expect(productsService.deleteProduct(productSku)).rejects.toThrow(
      NotFoundException,
    );

    expect(productsRepository.findProductByProductSku).toHaveBeenCalledWith(
      productSku,
    );
    expect(
      deletedProductsRepository.findDeletedProductByProductSku,
    ).toHaveBeenCalled();
  });

  it('should throw a ConflictException when trying to delete a product that has already been deleted', async () => {
    const productSku = 'alreadyDeletedProduct';

    (
      deletedProductsRepository.findDeletedProductByProductSku as jest.Mock
    ).mockResolvedValue({
      productSku: productSku,
    });

    await expect(productsService.deleteProduct(productSku)).rejects.toThrow(
      ConflictException,
    );

    expect(
      deletedProductsRepository.findDeletedProductByProductSku,
    ).toHaveBeenCalledWith(productSku);
    expect(productsRepository.findProductByProductSku).not.toHaveBeenCalled();
    expect(
      deletedProductsRepository.createDeletedProduct,
    ).not.toHaveBeenCalled();
  });

  it('should throw an InternalServerErrorException when an error occurs while deleting a product', async () => {
    const productSku = 'testProduct';

    (productsRepository.findProductByProductSku as jest.Mock).mockResolvedValue(
      {
        productSku: productSku,
        productName: 'Test Product',
        productBrand: 'Test Brand',
        productModel: 'Test Model',
        productCategory: 'Test Category',
        productColor: 'Test Color',
        productPrice: 100,
        productCurrency: 'USD',
        productStock: 10,
      },
    );

    (
      deletedProductsRepository.findDeletedProductByProductSku as jest.Mock
    ).mockResolvedValue(null);

    (
      deletedProductsRepository.createDeletedProduct as jest.Mock
    ).mockRejectedValue(new Error('Database error'));

    await expect(productsService.deleteProduct(productSku)).rejects.toThrow(
      InternalServerErrorException,
    );

    expect(productsRepository.findProductByProductSku).toHaveBeenCalledWith(
      productSku,
    );
    expect(
      deletedProductsRepository.findDeletedProductByProductSku,
    ).toHaveBeenCalledWith(productSku);
  });

  it('should delete a product successfully', async () => {
    const productSku = 'testProduct';

    (
      deletedProductsRepository.findDeletedProductByProductSku as jest.Mock
    ).mockResolvedValue(null);

    (productsRepository.findProductByProductSku as jest.Mock).mockResolvedValue(
      {
        productSku: productSku,
        productName: 'Test Product',
        productBrand: 'Test Brand',
        productModel: 'Test Model',
        productCategory: 'Test Category',
        productColor: 'Test Color',
        productPrice: 100,
        productCurrency: 'USD',
        productStock: 10,
      },
    );

    await productsService.deleteProduct(productSku);

    expect(
      deletedProductsRepository.findDeletedProductByProductSku,
    ).toHaveBeenCalledWith(productSku);

    expect(productsRepository.findProductByProductSku).toHaveBeenCalledWith(
      productSku,
    );

    expect(deletedProductsRepository.createDeletedProduct).toHaveBeenCalledWith(
      productSku,
    );
  });
});
