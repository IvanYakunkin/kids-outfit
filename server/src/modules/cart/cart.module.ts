import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from '../auth/auth.module';
import { ProductSize } from '../product-sizes/entities/product-sizes.entity';
import { CartController } from './cart.controller';
import { CartService } from './cart.service';
import { Cart } from './entities/cart.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Cart, ProductSize]), AuthModule],
  exports: [CartService],
  controllers: [CartController],
  providers: [CartService],
})
export class CartModule {}
