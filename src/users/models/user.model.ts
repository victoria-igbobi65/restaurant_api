import { Prop, SchemaFactory, Schema } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import * as bcrypt from 'bcryptjs';
import * as crypto from 'crypto';

import { Gender, Role } from 'src/common/constants/enums';

@Schema({ timestamps: true })
export class User extends Document {
  @Prop({ required: true })
  fullName: string;

  @Prop({ required: true, unique: true })
  email: string;

  @Prop({ default: null })
  countryCode: string;

  @Prop({ default: null })
  phonenumber: string;

  @Prop({ required: true })
  username: string;

  @Prop({ unique: true, default: null })
  googleId: string;

  @Prop({ enum: Gender, default: null })
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
  isActive: boolean;

  @Prop({ required: true, select: false })
  password: string;

  @Prop({ default: null })
  passwordChangedAt: Date;

  @Prop({ default: null })
  passwordResetToken: string;

  @Prop({ default: null })
  passwordResetExpires: Date;

  async validatePassword(password: string): Promise<boolean> {
    return await bcrypt.compare(password, this.password);
  }

  changePasswordAfter(JWTTimestamp: number) {
    if (this.passwordChangedAt) {
      const changedTimestamp = parseInt(
        (+this.passwordChangedAt.getTime() / 1000).toString(),
        10,
      );
      return JWTTimestamp < changedTimestamp;
    }

    return false;
  }

  createResetPasswordToken() {
    // GENERATE RESET TOKEN
    const resetToken = crypto.randomBytes(32).toString('hex');

    //ENCRYPT RESET TOKEN TO BE SAVED TO THE DB
    this.passwordResetToken = crypto
      .createHash('sha256')
      .update(resetToken)
      .digest('hex');

    // ADD A RESET TOKEN EXPIRES
    this.passwordResetExpires = new Date(Date.now() + 10 * 60 * 1000);

    return resetToken;
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
  next();
});

UserSchema.methods.validatePassword = async function (
  password: string,
): Promise<boolean> {
  return await bcrypt.compare(password, this.password);
};

// This method is used in token validation to check if a user's password has been changed since they were last issued a token.
UserSchema.methods.changePasswordAfter = function (JWTTimestamp: number) {
  if (this.passwordChangedAt) {
    const changedTimestamp = parseInt(
      (+this.passwordChangedAt.getTime() / 1000).toString(),
      10,
    );
    return JWTTimestamp < changedTimestamp;
  }

  return false;
};

UserSchema.methods.createResetPasswordToken = function () {
  // GENERATE RESET TOKEN
  const resetToken = crypto.randomBytes(32).toString('hex');

  //ENCRYPT RESET TOKEN TO BE SAVED TO THE DB
  this.passwordResetToken = crypto
    .createHash('sha256')
    .update(resetToken)
    .digest('hex');

  // ADD A RESET TOKEN EXPIRES
  this.passwordResetExpires = new Date(Date.now() + 10 * 60 * 1000);

  return resetToken;
};

/* Indexing */
UserSchema.index({ email: 1, phonenumber: 1 });
UserSchema.index({ googleId: 1 });
UserSchema.index({ email: 1 });
UserSchema.index({ id: 1 });
