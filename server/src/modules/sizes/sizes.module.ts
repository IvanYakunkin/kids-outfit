import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from '../auth/auth.module';
import { Size } from './entities/size.entity';
import { SizesController } from './sizes.controller';
import { SizesService } from './sizes.service';

@Module({
  imports: [TypeOrmModule.forFeature([Size]), AuthModule],
  controllers: [SizesController],
  providers: [SizesService],
  exports: [SizesService],
})
export class SizesModule {}
