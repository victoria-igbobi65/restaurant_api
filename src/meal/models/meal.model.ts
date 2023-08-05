import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';
import slugify from 'slugify';
import { specialTags } from 'src/common/constants/enums';

@Schema({ timestamps: true })
export class Meal extends Document {
  @Prop({ required: true, unique: true })
  name: string;

  @Prop({ required: true })
  price: number;

  @Prop({})
  slug: string;

  @Prop()
  description: string;

  @Prop({ type: MongooseSchema.Types.ObjectId, required: true })
  category: MongooseSchema.Types.ObjectId;

  @Prop({ default: true })
  isAvailable: boolean;

  @Prop({ required: true })
  imageUrl: string;

  @Prop({ enum: specialTags, default: null })
  label: string;

  @Prop({ default: 0 })
  ratings: number;

  @Prop({ default: null })
  preparationTime: number;

  @Prop({ default: null })
  nutritionalInfo: string;
}
export const MealSchema = SchemaFactory.createForClass(Meal);

MealSchema.pre('save', async function (next) {
  if (!this.isNew) return next();
  this.slug = slugify(this.name, { lower: true });
  this.name = this.name.toLowerCase();
  next();
});

MealSchema.index({ slug: 1 });
MealSchema.index({ name: 1 });
MealSchema.index({ id: 1 });
