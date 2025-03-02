import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ApiClientModule } from './api-client/api-client.module';
import {
  InternalProductsModule,
  ProductsModule,
  PublicProductsModule,
} from './products/products.module';
import { MongooseModule } from '@nestjs/mongoose';
import { RouterModule } from '@nestjs/core';
import { ScheduleModule } from '@nestjs/schedule';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [
    MongooseModule.forRoot(process.env.MONGODB_URI),
    ScheduleModule.forRoot(),
    ApiClientModule,
    ProductsModule,
    PublicProductsModule,
    InternalProductsModule,
    AuthModule,
    RouterModule.register([
      {
        path: 'internal',
        module: AuthModule,
      },
      {
        path: 'public',
        module: PublicProductsModule,
      },
      {
        path: 'internal',
        module: InternalProductsModule,
      },
    ]),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
