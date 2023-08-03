import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import slugify from 'slugify';

@Schema({ timestamps: true })
export class Category extends Document {
  @Prop({ required: true, unique: true })
  name: string;

  @Prop({})
  slug: string; // Add the slug field to store the generated slug

  @Prop({ required: true })
  imageUrl: string;
}

export const CategorySchema = SchemaFactory.createForClass(Category);

CategorySchema.pre('save', async function (next) {
  this.slug = slugify(this.name, { lower: true });
  this.name = this.name.toLowerCase();
  next();
});

CategorySchema.index({ name: 1 });
CategorySchema.index({ slug: 1 });
