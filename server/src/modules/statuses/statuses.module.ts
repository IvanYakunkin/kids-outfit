import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from '../auth/auth.module';
import { Status } from './entities/status.entity';
import { StatusesController } from './statuses.controller';
import { StatusesService } from './statuses.service';

@Module({
  imports: [TypeOrmModule.forFeature([Status]), AuthModule],
  controllers: [StatusesController],
  providers: [StatusesService],
})
export class StatusesModule {}
