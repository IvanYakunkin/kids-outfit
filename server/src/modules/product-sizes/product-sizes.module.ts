import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from '../auth/auth.module';
import { Product } from '../products/entities/product.entity';
import { ProductsModule } from '../products/products.module';
import { ProductSize } from './entities/product-sizes.entity';
import { ProductSizesController } from './product-sizes.controller';
import { ProductSizesService } from './product-sizes.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([ProductSize, Product]),
    AuthModule,
    ProductsModule,
  ],
  controllers: [ProductSizesController],
  providers: [ProductSizesService],
  exports: [ProductSizesService, TypeOrmModule],
})
export class ProductSizesModule {}
