export class SysDto {
  type: string;
}

export class SpaceSysDto {
  type: string;
  linkType: string;
  id: string;
}

export class EnvironmentSysDto {
  id: string;
  type: string;
  linkType: string;
}

export class ContentTypeSysDto {
  type: string;
  linkType: string;
  id: string;
}

export class ProductSysDto {
  space: SpaceSysDto;
  id: string;
  type: string;
  createdAt: string;
  updatedAt: string;
  environment: EnvironmentSysDto;
  revision: number;
  contentType: ContentTypeSysDto;
  locale: string;
}

export class ProductFieldsDto {
  sku: string;
  name: string;
  brand: string;
  model: string;
  category: string;
  color: string;
  price: number;
  currency: string;
  stock: number;
}

export class ProductDto {
  metadata: { tags: any[] };
  sys: ProductSysDto;
  fields: ProductFieldsDto;
}

export class ProductsResponseDto {
  sys: SysDto;
  total: number;
  skip: number;
  limit: number;
  items: ProductDto[];
}
