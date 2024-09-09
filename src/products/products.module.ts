import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Product, ProductSchema } from './repository/schemas/product.schema';
import { ProductsRepository } from './repository/products.repository';
import { ProductsService } from './products.service';
import { ApiClientModule } from '../api-client/api-client.module';
import { ProductsController } from './products.controller';

@Module({
  imports: [
    ApiClientModule,
    MongooseModule.forFeature([{ name: Product.name, schema: ProductSchema }]),
  ],
  providers: [ProductsRepository, ProductsService],
  controllers: [ProductsController],
})
export class ProductsModule {}
