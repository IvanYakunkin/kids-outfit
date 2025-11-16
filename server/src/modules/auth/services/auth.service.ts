import { Injectable, UnauthorizedException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { CreateUserDto } from '../../users/dto/create-user.dto';
import { UsersService } from '../../users/users.service';
import { AuthResponseDto } from '../dto/auth-response.dto';
import { LoginDto } from '../dto/login.dto';
import { TokensService } from './token.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly tokensService: TokensService,
  ) {}

  async registration(userData: CreateUserDto): Promise<AuthResponseDto> {
    const user = await this.usersService.create(userData);
    const tokens = this.tokensService.generateTokens({
      id: user.id,
      isAdmin: user.isAdmin,
    });
    await this.tokensService.saveRefreshToken(user, tokens.refreshToken);
    const { password, ...userWithoutPassword } = user;

    return { user: userWithoutPassword, tokens };
  }

  async login(loginDto: LoginDto): Promise<AuthResponseDto> {
    const user = await this.usersService.findUserByPhone(loginDto.phone);
    if (!user) {
      throw new UnauthorizedException(
        'Пользователь с таким телефоном не найден',
      );
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
    await this.tokensService.saveRefreshToken(user, tokens.refreshToken);
    const { password, ...userWithoutPassword } = user;

    return { user: userWithoutPassword, tokens };
  }

  async logout(refreshToken: string) {
    const token = await this.tokensService.removeToken(refreshToken);
    return token;
  }

  async refresh(refreshToken: string): Promise<AuthResponseDto> {
    if (!refreshToken) {
      throw new UnauthorizedException('Ошибка аутентификации');
    }

    const userData = this.tokensService.validateRefreshToken(refreshToken);
    const tokenFromDb = await this.tokensService.findToken(refreshToken);

    if (!userData || !tokenFromDb) {
      throw new UnauthorizedException('Ошибка аутентификации');
    }

    if (userData && typeof userData !== 'string') {
      const user = await this.usersService.findUserById(userData.id);

      if (!user) {
        throw new UnauthorizedException('Ошибка аутентификации');
      }

      const { password, ...userWithoutPassword } = user;
      const tokens = this.tokensService.generateTokens({
        id: user.id,
        isAdmin: user.isAdmin,
      });

      await this.tokensService.saveRefreshToken(user, tokens.refreshToken);

      return {
        user: userWithoutPassword,
        tokens,
      };
    }

    throw new UnauthorizedException('Ошибка аутентификации');
  }
}
