import { Prop, SchemaFactory, Schema } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import * as bcrypt from 'bcryptjs';

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

  @Prop({ default: null })
  address: string;

  @Prop({ default: Role.USER })
  role: string;

  @Prop({ default: false })
  accountVerified: boolean;

  @Prop({ default: true })
  active: boolean;

  @Prop({ required: true, select: false })
  password: string;

  @Prop({ default: null })
  passwordChangedAt: Date;

  @Prop({ default: null })
  passwordResetToken: string;

  @Prop({ default: null })
  passwordResetexpires: Date;

  async validatePassword(password: string): Promise<boolean> {
    return await bcrypt.compare(password, this.password);
  }
}
export const UserSchema = SchemaFactory.createForClass(User);

/* first pre hook */
UserSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next(); // this checks if password has been not been changed since the last save, to prevent hashing the password again. especially for cases where users just want to update their profile without updating their password

  this.password = await bcrypt.hash(this.password, 10);
  next();
});

/* second pre hook*/
UserSchema.pre('save', function (next) {
  if (!this.isModified('password') || this.isNew) return next();

  this.passwordChangedAt = new Date(Date.now() - 1000);
});

UserSchema.methods.validatePassword = async function (
  password: string,
): Promise<boolean> {
  return await bcrypt.compare(password, this.password);
};

// // This method is used in token validation to check if a user's password has been changed since they were last issued a token.
// changePasswordAfter(JWTTimestamp: number) {
//   if (this.passwordChangedAt) {
//     const changedTimestamp = parseInt(
//       (+this.passwordChangedAt.getTime() / 1000).toString(),
//       10,
//     );
//     return JWTTimestamp < changedTimestamp;
//   }

//   return false;
// }

/* Indexing */
UserSchema.index({ email: 1, phonenumber: 1 });
UserSchema.index({ googleId: 1 });
