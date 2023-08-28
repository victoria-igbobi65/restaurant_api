import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import slugify from 'slugify';
import { mealMeasurementUnits, specialTags } from 'src/common/constants/enums';

@Schema({ timestamps: true })
export class Meal extends Document {
  @Prop({ required: true, unique: true })
  name: string;

  @Prop({ required: true })
  pricePerMeasurement: number;

  @Prop({ required: true, enum: mealMeasurementUnits })
  measurement: string;

  @Prop({})
  slug: string;

  @Prop()
  description: string;

  @Prop({ type: Types.ObjectId, required: true, ref: 'Category' })
  category: Types.ObjectId;

  @Prop({ default: true })
  isAvailable: boolean;

  @Prop({ default: null })
  imageUrl: string;

  @Prop({ type: [String], enum: [specialTags], default: [] })
  label: string[];

  @Prop({ type: [String], default: [] })
  ingredients: string[];

  @Prop({ default: 0 })
  rating: number;

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
