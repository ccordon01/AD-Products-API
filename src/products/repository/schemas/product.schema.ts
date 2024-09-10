import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema()
export class Product extends Document {
  @Prop({ required: true })
  productSku: string;

  @Prop({ required: true })
  productName: string;

  @Prop({ required: true })
  productBrand: string;

  @Prop()
  productModel: string;

  @Prop()
  productCategory: string;

  @Prop()
  productColor: string;

  @Prop({ required: true })
  productPrice: number;

  @Prop()
  productCurrency: string;

  @Prop()
  productStock: number;

  @Prop({ default: Date.now })
  ProductCreatedAt: Date;
}

export const ProductSchema = SchemaFactory.createForClass(Product);
