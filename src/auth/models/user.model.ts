import { Prop, SchemaFactory, Schema } from '@nestjs/mongoose';

import { Gender, Role } from 'src/common/constants/enums';

@Schema({ timestamps: true })
export class User extends Document {
  @Prop({ required: true })
  fullName: string;

  @Prop({ required: true, unique: true })
  email: string;

  @Prop({ required: true })
  countryCode: string;

  @Prop({ required: true })
  phonenumber: string;

  @Prop({ required: true })
  username: string;

  @Prop({ unique: true, default: null })
  googleId: string;

  @Prop({ enum: Gender, required: true })
  gender: string;

  @Prop({ default: null })
  profilePic: string;

  @Prop({ default: Role.USER })
  role: string;

  @Prop({ default: false })
  accountVerified: boolean;

  @Prop({ default: true })
  active: boolean;
}
export const UserSchema = SchemaFactory.createForClass(User);

/* Indexing */
UserSchema.index({ email: 1, phonenumber: 1 });
UserSchema.index({ googleId: 1 });
