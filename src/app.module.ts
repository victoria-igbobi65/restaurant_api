import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { CategoryModule } from './category/category.module';
import { MealModule } from './meal/meal.module';
import { OrderModule } from './order/order.module';
import { TraysModule } from './trays/trays.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    MongooseModule.forRoot(`${process.env.DB_URL}`, {
      useUnifiedTopology: true,
      useNewUrlParser: true,
    }),
    AuthModule,
    UsersModule,
    CategoryModule,
    MealModule,
    OrderModule,
    TraysModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
