import { HttpService } from '@nestjs/axios';
import { Injectable, Logger } from '@nestjs/common';
import { AxiosError } from 'axios';
import { catchError, firstValueFrom } from 'rxjs';

@Injectable()
export class ApiClientService {
  private readonly logger = new Logger(ApiClientService.name);
  constructor(private readonly httpService: HttpService) {}

  async fetchProducts(): Promise<any[]> {
    try {
      const { data } = await firstValueFrom(
        this.httpService
          .get<any[]>(process.env.CONTENTFUL_URL, {
            baseURL: `spaces/${process.env.CONTENTFUL_SPACE_ID}/environments/${process.env.CONTENTFUL_ENVIRONMENT}/entries`,
            params: {
              access_token: process.env.CONTENTFUL_ACCESS_TOKEN,
              content_type: process.env.CONTENTFUL_PRODUCTS_CONTENT_TYPE,
            },
          })
          .pipe(
            catchError((error: AxiosError) => {
              this.logger.error(error?.response?.data);
              if (error.response) {
                // The request was made and the server responded with a status code
                // that falls out of the range of 2xx
                return Promise.reject(error.response?.data);
              } else if (error.request) {
                // The request was made but no response was received
                // `error.request` is an instance of XMLHttpRequest in the browser and an instance of
                // http.ClientRequest in node.js
                return Promise.reject(error.request);
              } else {
                // Something happened in setting up the request that triggered an Error
                return Promise.reject({
                  status: error.status,
                  message: error.message,
                });
              }
            }),
          ),
      );
      return data;
    } catch (error) {
      // Handle the error here
      this.logger.error('Error in fetchProducts:', error);
      throw error;
    }
  }
}
