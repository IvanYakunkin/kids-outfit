import {
  Body,
  Controller,
  Get,
  HttpCode,
  Post,
  Req,
  Res,
  UnauthorizedException,
  UseGuards,
} from '@nestjs/common';
import { ApiBody, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Request, Response } from 'express';
import { CreateUserDto } from '../users/dto/create-user.dto';
import { UserResponseDto } from '../users/dto/user-response.dto';
import { UsersService } from '../users/users.service';
import { LoginDto } from './dto/login.dto';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { NoAuthGuard } from './guards/jwt-no-auth.guard';
import { JwtPayload } from './interfaces/jwt-payload.interface';
import { AuthService } from './services/auth.service';
import { CookieService } from './services/cookie.service';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly usersService: UsersService,
  ) {}

  @UseGuards(NoAuthGuard)
  @Post('registration')
  @HttpCode(201)
  @ApiOperation({ summary: 'Регистрация нового пользователя' })
  @ApiBody({ type: CreateUserDto })
  @ApiResponse({
    status: 201,
    description: 'Пользователь успешно зарегистрирован',
    type: UserResponseDto,
  })
  @ApiResponse({
    status: 400,
    description: 'Некорректные данные или пользователь уже существует',
  })
  async registration(
    @Body() createUserDto: CreateUserDto,
    @Res({ passthrough: true }) res: Response,
    @Req() req: Request,
  ) {
    const userData = await this.authService.registration(createUserDto, req);
    CookieService.setRefreshToken(res, userData.tokens.refreshToken);
    CookieService.setAccessToken(res, userData.tokens.accessToken);
    CookieService.setCsrfToken(res);

    return userData.user;
  }

  @UseGuards(NoAuthGuard)
  @Post('login')
  @ApiOperation({ summary: 'Авторизация пользователя' })
  @ApiBody({ type: LoginDto })
  @ApiResponse({
    status: 201,
    description: 'Успешный вход',
    type: UserResponseDto,
  })
  @ApiResponse({ status: 401, description: 'Неверные данные входа' })
  async login(
    @Body() loginDto: LoginDto,
    @Res({ passthrough: true }) res: Response,
    @Req() req: Request,
  ) {
    const userData = await this.authService.login(loginDto, req);
    CookieService.setRefreshToken(res, userData.tokens.refreshToken);
    CookieService.setAccessToken(res, userData.tokens.accessToken);
    CookieService.setCsrfToken(res);

    return userData.user;
  }

  @Post('logout')
  @ApiOperation({ summary: 'Выход из системы' })
  @ApiResponse({ status: 200, description: 'Пользователь вышел' })
  @ApiResponse({ status: 401, description: 'Пользователь не авторизован' })
  async logout(@Req() req: Request, @Res({ passthrough: true }) res: Response) {
    const refreshToken = CookieService.getRefreshToken(req);
    if (refreshToken) {
      const resultMsg = await this.authService.logout(refreshToken);

      CookieService.clearAccessToken(res);
      CookieService.clearRefreshToken(res);
      CookieService.clearCsrfTokne(res);

      return resultMsg;
    }
  }

  @Post('refresh')
  @ApiOperation({ summary: 'Обновление токенов авторизации' })
  @ApiResponse({
    status: 201,
    description: 'Токены обновлены',
    type: UserResponseDto,
  })
  @ApiResponse({ status: 401, description: 'Пользователь не авторизован' })
  async refresh(
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response,
  ) {
    const refreshToken = CookieService.getRefreshToken(req);
    const newUserData = await this.authService.refreshTokens(req, refreshToken);

    CookieService.setRefreshToken(res, newUserData.tokens.refreshToken);
    CookieService.setAccessToken(res, newUserData.tokens.accessToken);
    CookieService.setCsrfToken(res);

    return newUserData.user;
  }

  @UseGuards(JwtAuthGuard)
  @Get('me')
  async getMe(@Req() req: Request) {
    const userPayload = req.user as JwtPayload | undefined;
    if (!userPayload) {
      throw new UnauthorizedException('Пользователь не авторизован');
    }

    const userResponse: UserResponseDto = {
      id: userPayload.id,
      isAdmin: userPayload.isAdmin,
    };

    return userResponse;
  }
}
