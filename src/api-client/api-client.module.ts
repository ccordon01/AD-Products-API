import { Module } from '@nestjs/common';
import { ApiClientService } from './api-client.service';
import { HttpModule } from '@nestjs/axios';

@Module({
  imports: [HttpModule],
  providers: [ApiClientService],
  exports: [ApiClientService],
})
export class ApiClientModule {}
