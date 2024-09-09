import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Product, ProductSchema } from './repository/schemas/product.schema';
import { ProductsRepository } from './repository/products.repository';
import { ProductsService } from './products.service';
import { ApiClientModule } from '../api-client/api-client.module';
import { PublicProductsController } from './controllers/public-products.controller';

@Module({
  imports: [
    ApiClientModule,
    MongooseModule.forFeature([{ name: Product.name, schema: ProductSchema }]),
  ],
  providers: [ProductsRepository, ProductsService],
  exports: [ProductsService],
})
export class ProductsModule {}

@Module({
  imports: [ProductsModule],
  controllers: [PublicProductsController],
})
export class PublicProductsModule {}
