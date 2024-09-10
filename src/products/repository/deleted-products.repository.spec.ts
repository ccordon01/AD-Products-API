import { Model } from 'mongoose';
import { DeletedProduct } from './schemas/deleted-product.schema';
import { DeletedProductsRepository } from './deleted-products.repository';

describe('DeletedProductsRepository', () => {
  let deletedProductModel: jest.Mocked<Model<DeletedProduct>>;
  let deletedProductsRepository: DeletedProductsRepository;

  beforeEach(() => {
    const mockDocument = {
      save: jest.fn().mockResolvedValue({}),
    };

    deletedProductModel = {
      find: jest.fn().mockReturnValue({
        skip: jest.fn().mockReturnThis(),
        limit: jest.fn().mockReturnThis(),
        exec: jest.fn(),
      }),
      countDocuments: jest.fn().mockReturnValue({
        exec: jest.fn(),
      }),
      findOne: jest.fn().mockReturnValue({
        exec: jest.fn().mockResolvedValue(null),
      }),
      create: jest.fn().mockResolvedValue(mockDocument),
    } as unknown as jest.Mocked<Model<DeletedProduct>>;

    deletedProductsRepository = new DeletedProductsRepository(
      deletedProductModel,
    );
  });

  it('should return an empty array when no deleted products exist in the database', async () => {
    (deletedProductModel.find as jest.Mock).mockReturnValue({
      skip: jest.fn().mockReturnThis(),
      limit: jest.fn().mockReturnThis(),
      exec: jest.fn().mockResolvedValue([]),
    });

    const result = await deletedProductsRepository.findAllDeletedProducts();

    expect(result).toEqual([]);
  });

  it('should successfully create a new deleted product entry in the database', async () => {
    const productSku = 'testProduct';
    const expectedDeletedProduct: Partial<DeletedProduct> = {
      productSku,
    };

    (deletedProductModel.create as jest.Mock).mockResolvedValue(
      expectedDeletedProduct,
    );

    const result =
      await deletedProductsRepository.createDeletedProduct(productSku);

    expect(result).toEqual(expectedDeletedProduct);
    expect(deletedProductModel.create).toHaveBeenCalledWith({ productSku });
  });

  it('should find a deleted product by product SKU', async () => {
    const productSku = 'testProduct';
    const expectedDeletedProduct: Partial<DeletedProduct> = {
      productSku,
    };

    (deletedProductModel.findOne as jest.Mock).mockReturnValue({
      exec: jest.fn().mockResolvedValue(expectedDeletedProduct),
    });

    const result =
      await deletedProductsRepository.findDeletedProductByProductSku(
        productSku,
      );

    expect(result).toEqual(expectedDeletedProduct);
    expect(deletedProductModel.findOne).toHaveBeenCalledWith({ productSku });
  });
});
