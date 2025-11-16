import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersModule } from '../users/users.module';
import { AuthController } from './auth.controller';
import { RefreshToken } from './entities/token.entity';
import { AdminGuard } from './guards/jwt-admin.guard';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { NoAuthGuard } from './guards/jwt-no-auth.guard';
import { AuthService } from './services/auth.service';
import { TokensService } from './services/token.service';

@Module({
  imports: [TypeOrmModule.forFeature([RefreshToken]), UsersModule],
  controllers: [AuthController],
  providers: [
    AuthService,
    TokensService,
    JwtAuthGuard,
    NoAuthGuard,
    AdminGuard,
    TokensService,
  ],
  exports: [JwtAuthGuard, NoAuthGuard, AdminGuard, TokensService],
})
export class AuthModule {}
