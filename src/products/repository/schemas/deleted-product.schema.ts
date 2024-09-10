import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema()
export class DeletedProduct extends Document {
  @Prop({ required: true, unique: true })
  productSku: string;

  @Prop({ default: Date.now })
  ProductDeletedAt: Date;
}

export const DeletedProductSchema =
  SchemaFactory.createForClass(DeletedProduct);
