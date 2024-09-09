import { Test, TestingModule } from '@nestjs/testing';
import { ProductsService } from '../products.service';
import { ProductsRepository } from '../repository/products.repository';
import { ApiClientService } from '../../api-client/api-client.service';
import { PublicProductsController } from './public-products.controller';

describe('PublicProductsController', () => {
  let controller: PublicProductsController;

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
      controllers: [PublicProductsController],
    }).compile();
    controller = module.get<PublicProductsController>(PublicProductsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
