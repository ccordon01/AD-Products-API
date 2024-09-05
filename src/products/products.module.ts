import { Module } from '@nestjs/common';
import { ProductsService } from './products.service';
import { ProductsRepository } from './repository/products.repository';
import { ApiClientModule } from 'src/api-client/api-client.module';

@Module({
  imports: [ApiClientModule],
  providers: [ProductsRepository, ProductsService],
})
export class ProductsModule {}
