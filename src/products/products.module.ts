import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Product, ProductSchema } from './repository/schemas/product.schema';
import { ProductsRepository } from './repository/products.repository';
import { ProductsService } from './products.service';
import { ApiClientModule } from '../api-client/api-client.module';
import { PublicProductsController } from './controllers/public-products.controller';
import {
  DeletedProduct,
  DeletedProductSchema,
} from './repository/schemas/deleted-product.schema';
import { DeletedProductsRepository } from './repository/deleted-products.repository';
import { InternalProductsController } from './controllers/internal-products.controller';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [
    ApiClientModule,
    MongooseModule.forFeature([
      { name: Product.name, schema: ProductSchema },
      { name: DeletedProduct.name, schema: DeletedProductSchema },
    ]),
  ],
  providers: [ProductsRepository, DeletedProductsRepository, ProductsService],
  exports: [ProductsService],
})
export class ProductsModule {}

@Module({
  imports: [ProductsModule],
  controllers: [PublicProductsController],
})
export class PublicProductsModule {}

@Module({
  imports: [ProductsModule, AuthModule],
  controllers: [InternalProductsController],
})
export class InternalProductsModule {}
