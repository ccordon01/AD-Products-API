import { Injectable } from '@nestjs/common';
import { Product } from './schemas/product.schema';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { CreateProductDto } from '../dto/create-product.dto';
import { FilterProductsDto } from '../dto/filter-products.dto';

@Injectable()
export class ProductsRepository {
  constructor(
    @InjectModel(Product.name) private productModel: Model<Product>,
  ) {}

  async createProduct(createProudctDto: CreateProductDto): Promise<Product> {
    return this.productModel.create(createProudctDto);
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

  async findFilteredProducts(
    filterProductsDto: FilterProductsDto,
    excludeProductSkus: string[] = [],
  ): Promise<any> {
    const { skip, limit } = filterProductsDto;
    let query = {};

    if (filterProductsDto.productSku) {
      query['productSku'] = filterProductsDto.productSku;
    }

    if (excludeProductSkus.length) {
      query['productSku'] = { $nin: excludeProductSkus };
    }

    if (filterProductsDto.productSku && excludeProductSkus.length) {
      query = {
        $and: [
          { productSku: filterProductsDto.productSku },
          { productSku: { $nin: excludeProductSkus } },
        ],
      };
    }

    if (filterProductsDto.productName) {
      query['productName'] = filterProductsDto.productName;
    }

    if (filterProductsDto.productBrand) {
      query['productBrand'] = filterProductsDto.productBrand;
    }

    if (filterProductsDto.productModel) {
      query['productModel'] = filterProductsDto.productModel;
    }

    if (filterProductsDto.productCategory) {
      query['productCategory'] = filterProductsDto.productCategory;
    }

    if (filterProductsDto.productColor) {
      query['productColor'] = filterProductsDto.productColor;
    }

    if (
      filterProductsDto.productMinPrice &&
      filterProductsDto.productMaxPrice
    ) {
      query['productPrice'] = {
        $gte: filterProductsDto.productMinPrice,
        $lte: filterProductsDto.productMaxPrice,
      };
    } else if (filterProductsDto.productMinPrice) {
      query['productPrice'] = { $gte: filterProductsDto.productMinPrice };
    } else if (filterProductsDto.productMaxPrice) {
      query['productPrice'] = { $lte: filterProductsDto.productMaxPrice };
    }

    if (filterProductsDto.productCurrency) {
      query['productCurrency'] = filterProductsDto.productCurrency;
    }

    if (
      filterProductsDto.productMinStock &&
      filterProductsDto.productMaxStock
    ) {
      query['productStock'] = {
        $gte: filterProductsDto.productMinStock,
        $lte: filterProductsDto.productMaxStock,
      };
    } else if (filterProductsDto.productMinStock) {
      query['productStock'] = { $gte: filterProductsDto.productMinStock };
    } else if (filterProductsDto.productMaxStock) {
      query['productStock'] = { $lte: filterProductsDto.productMaxStock };
    }

    const totalCount = await this.productModel.countDocuments(query).exec();
    const products = await this.productModel
      .find(query)
      .skip(skip)
      .limit(limit)
      .exec();

    return {
      totalCount,
      products,
    };
  }

  async findProductByProductSku(productSku: string): Promise<Product> {
    return this.productModel.findOne({ productSku }).exec();
  }

  async countProductsByProductSku(productSkus: string[]): Promise<number> {
    const count = await this.productModel
      .countDocuments({
        productSku: { $in: productSkus },
      })
      .exec();
    return count;
  }

  async countAllUniqueProductSkus(): Promise<number> {
    const result = await this.productModel
      .aggregate([
        {
          $group: {
            _id: '$productSku',
          },
        },
        {
          $count: 'uniqueSkusCount',
        },
      ])
      .exec();

    return result.length > 0 ? result[0].uniqueSkusCount : 0;
  }
}
