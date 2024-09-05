import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ApiClientModule } from './api-client/api-client.module';

@Module({
  imports: [ApiClientModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
