import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ApiClientModule } from './api-client/api-client.module';
import {
  ProductsModule,
  PublicProductsModule,
} from './products/products.module';
import { MongooseModule } from '@nestjs/mongoose';
import { RouterModule } from '@nestjs/core';

@Module({
  imports: [
    MongooseModule.forRoot(process.env.MONGODB_URI),
    ApiClientModule,
    ProductsModule,
    PublicProductsModule,
    RouterModule.register([
      {
        path: 'public',
        module: PublicProductsModule,
      },
    ]),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
