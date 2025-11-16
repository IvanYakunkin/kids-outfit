import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from './modules/auth/auth.module';
import { CartModule } from './modules/cart/cart.module';
import { CategoriesModule } from './modules/categories/categories.module';
import { CharacteristicsModule } from './modules/characteristics/characteristics.module';
import { OrdersModule } from './modules/orders/orders.module';
import { ProductCharsModule } from './modules/product-characteristics/product-characteristics.module';
import { ProductSizesModule } from './modules/product-sizes/product-sizes.module';
import { ProductsModule } from './modules/products/products.module';
import { SizesModule } from './modules/sizes/sizes.module';
import { StatusesModule } from './modules/statuses/statuses.module';
import { UsersModule } from './modules/users/users.module';

@Module({
  imports: [
    ConfigModule.forRoot(),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DATABASE_HOST,
      port: +process.env.DATABASE_PORT! || 5432,
      username: process.env.DATABASE_USERNAME,
      password: process.env.DATABASE_PASSWORD,
      database: process.env.DATABASE_NAME,
      entities: [__dirname + '/**/*.entity{.ts,.js}'],
      migrations: [__dirname + 'src/migration/**/*.ts'],
      //synchronize: true,  // Delete in production
    }),
    ProductsModule,
    CategoriesModule,
    UsersModule,
    ProductSizesModule,
    CharacteristicsModule,
    OrdersModule,
    ProductCharsModule,
    StatusesModule,
    AuthModule,
    SizesModule,
    CartModule,
  ],
})
export class AppModule {}
