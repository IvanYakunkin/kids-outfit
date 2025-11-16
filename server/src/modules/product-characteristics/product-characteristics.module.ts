import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from '../auth/auth.module';
import { ProductChars } from './entities/product-characteristic.entity';
import { ProductCharsController } from './product-characteristics.controller';
import { ProductCharsService } from './product-characteristics.service';

@Module({
  imports: [TypeOrmModule.forFeature([ProductChars]), AuthModule],
  controllers: [ProductCharsController],
  providers: [ProductCharsService],
})
export class ProductCharsModule {}
