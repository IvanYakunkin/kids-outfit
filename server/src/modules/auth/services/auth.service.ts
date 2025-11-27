import { Injectable, UnauthorizedException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { Request } from 'express';
import { UserResponseDto } from 'src/modules/users/dto/user-response.dto';
import { CreateUserDto } from '../../users/dto/create-user.dto';
import { UsersService } from '../../users/users.service';
import { LoginDto } from '../dto/login.dto';
import { TokensService } from './tokens.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly tokensService: TokensService,
  ) {}

  async registration(userData: CreateUserDto, req: Request) {
    const user = await this.usersService.create(userData);
    const userResponse: UserResponseDto = {
      id: user.id,
      isAdmin: user.isAdmin,
    };

    const tokens = this.tokensService.generateTokens(userResponse);

    await this.tokensService.saveRefreshToken(
      user,
      this.tokensService.hashToken(tokens.refreshToken),
      req.ip,
      req.headers['user-agent'],
    );

    return { user: userResponse, tokens };
  }

  async login(loginDto: LoginDto, req: Request) {
    const user = await this.usersService.findUserByPhone(loginDto.phone);
    if (!user) {
      throw new UnauthorizedException('Неверные данные входа');
    }

    const isCorrectPassword = await bcrypt.compare(
      loginDto.password,
      user.password,
    );
    if (!isCorrectPassword) {
      throw new UnauthorizedException('Неверные данные входа');
    }

    const tokens = this.tokensService.generateTokens({
      id: user.id,
      isAdmin: user.isAdmin,
    });

    await this.tokensService.saveRefreshToken(
      user,
      this.tokensService.hashToken(tokens.refreshToken),
      req.ip,
      req.headers['user-agent'],
    );

    const userResponse: UserResponseDto = {
      id: user.id,
      isAdmin: user.isAdmin,
    };

    return { user: userResponse, tokens };
  }

  async logout(refreshToken: string) {
    if (refreshToken) {
      const hashedToken = this.tokensService.hashToken(refreshToken);
      const tokenInDb = await this.tokensService.findToken(hashedToken);
      if (tokenInDb) {
        await this.tokensService.removeToken(tokenInDb);
      }
    }

    return { message: 'Вы успешно вышли из системы' };
  }

  async refreshTokens(req: Request, refreshToken: string) {
    if (!refreshToken) {
      throw new UnauthorizedException('Вы не авторизованы');
    }

    const hashedToken = this.tokensService.hashToken(refreshToken);

    const tokenInDb = await this.tokensService.findToken(hashedToken);
    if (!tokenInDb || tokenInDb.expiresAt < new Date()) {
      throw new UnauthorizedException('Вы не авторизованы');
    }

    const user = tokenInDb.user;

    await this.tokensService.removeToken(tokenInDb);

    const payload = { id: user.id, isAdmin: user.isAdmin };
    const tokens = this.tokensService.generateTokens(payload);

    const newTokenHash = this.tokensService.hashToken(tokens.refreshToken);

    this.tokensService.saveRefreshToken(
      user,
      newTokenHash,
      req.ip,
      req.headers['user-agent'],
    );

    const userResponse: UserResponseDto = {
      id: user.id,
      isAdmin: user.isAdmin,
    };

    return { user: userResponse, tokens };
  }
}
