import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from '../auth/auth.module';
import { CharacteristicsModule } from '../characteristics/characteristics.module';
import { Characteristic } from '../characteristics/entities/characteristic.entity';
import { Product } from '../products/entities/product.entity';
import { ProductChars } from './entities/product-characteristic.entity';
import { ProductCharsController } from './product-characteristics.controller';
import { ProductCharsService } from './product-characteristics.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([ProductChars, Product, Characteristic]),
    AuthModule,
    CharacteristicsModule,
    ProductCharsModule,
  ],
  controllers: [ProductCharsController],
  providers: [ProductCharsService],
})
export class ProductCharsModule {}
