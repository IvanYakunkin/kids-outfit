import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from '../auth/auth.module';
import { CharacteristicsController } from './characteristics.controller';
import { CharacteristicsService } from './characteristics.service';
import { Characteristic } from './entities/characteristic.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Characteristic]), AuthModule],
  controllers: [CharacteristicsController],
  providers: [CharacteristicsService],
  exports: [CharacteristicsService],
})
export class CharacteristicsModule {}
