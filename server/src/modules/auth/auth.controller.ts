import {
  Body,
  Controller,
  HttpCode,
  Post,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { ApiBody, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Request, Response } from 'express';
import { CreateUserDto } from '../users/dto/create-user.dto';
import { AuthResponseDto } from './dto/auth-response.dto';
import { LoginDto } from './dto/login.dto';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { NoAuthGuard } from './guards/jwt-no-auth.guard';
import { AuthService } from './services/auth.service';
import { CookieService } from './services/cookie.service';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @UseGuards(NoAuthGuard)
  @Post('registration')
  @HttpCode(201)
  @ApiOperation({ summary: 'Регистрация нового пользователя' })
  @ApiBody({ type: CreateUserDto })
  @ApiResponse({
    status: 201,
    description: 'Пользователь успешно зарегистрирован',
    type: AuthResponseDto,
  })
  @ApiResponse({
    status: 400,
    description: 'Некорректные данные или пользователь уже существует',
  })
  async registration(
    @Body() createUserDto: CreateUserDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    const userData = await this.authService.registration(createUserDto);
    CookieService.setRefreshToken(res, userData.tokens.refreshToken);

    return userData;
  }

  @UseGuards(NoAuthGuard)
  @Post('login')
  @ApiOperation({ summary: 'Авторизация пользователя' })
  @ApiBody({ type: LoginDto })
  @ApiResponse({
    status: 200,
    description: 'Успешный вход',
    type: AuthResponseDto,
  })
  @ApiResponse({ status: 401, description: 'Неверные данные входа' })
  async login(
    @Body() loginDto: LoginDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    const userData = await this.authService.login(loginDto);
    CookieService.setRefreshToken(res, userData.tokens.refreshToken);

    return userData;
  }

  @UseGuards(JwtAuthGuard)
  @Post('logout')
  @ApiOperation({ summary: 'Выход из системы' })
  @ApiResponse({ status: 200, description: 'Пользователь вышел' })
  @ApiResponse({ status: 401, description: 'Пользователь не авторизован' })
  async logout(@Req() req: Request, @Res({ passthrough: true }) res: Response) {
    const refreshToken = CookieService.getRefreshToken(req);
    const token = await this.authService.logout(refreshToken);
    CookieService.clearRefreshToken(res);

    return token;
  }

  @UseGuards(JwtAuthGuard)
  @Post('refresh')
  @ApiOperation({ summary: 'Обновление токена' })
  @ApiResponse({
    status: 200,
    description: 'Токен обновлен',
    type: AuthResponseDto,
  })
  @ApiResponse({ status: 401, description: 'Пользователь не авторизован' })
  async refresh(
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response,
  ) {
    const refreshToken = CookieService.getRefreshToken(req);
    const userData = await this.authService.refresh(refreshToken);
    CookieService.setRefreshToken(res, userData.tokens.refreshToken);

    return userData;
  }
}
