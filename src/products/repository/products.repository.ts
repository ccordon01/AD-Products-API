import { Injectable } from '@nestjs/common';
import { Product } from './schemas/product.schema';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { CreateProductDto } from '../dto/create-product.dto';

@Injectable()
export class ProductsRepository {
  constructor(
    @InjectModel(Product.name) private productModel: Model<Product>,
  ) {}

  async createProduct(createProudctDto: CreateProductDto): Promise<Product> {
    const createdProduct = new this.productModel(createProudctDto);
    return createdProduct.save();
  }

  async createProducts(createProductsDto: CreateProductDto[]) {
    await this.productModel.insertMany(createProductsDto);
  }

  async findAllProducts(): Promise<Product[]> {
    return this.productModel.find().exec();
  }

  async countProducts(): Promise<number> {
    const count = await this.productModel.countDocuments().exec();
    return count;
  }
}
