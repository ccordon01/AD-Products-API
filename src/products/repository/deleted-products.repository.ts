import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { DeletedProduct } from './schemas/deleted-product.schema';
import { Model } from 'mongoose';

@Injectable()
export class DeletedProductsRepository {
  constructor(
    @InjectModel(DeletedProduct.name)
    private deletedProductModel: Model<DeletedProduct>,
  ) {}

  async findAllDeletedProducts(): Promise<DeletedProduct[]> {
    return this.deletedProductModel.find().exec();
  }

  async createDeletedProduct(productSku: string): Promise<DeletedProduct> {
    return this.deletedProductModel.create({ productSku });
  }

  async findDeletedProductByProductSku(
    productSku: string,
  ): Promise<DeletedProduct> {
    return this.deletedProductModel.findOne({ productSku }).exec();
  }
}
