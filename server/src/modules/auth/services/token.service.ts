import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import * as jwt from 'jsonwebtoken';
import { User } from 'src/modules/users/entities/user.entity';
import { Repository } from 'typeorm';
import { RefreshToken } from '../entities/token.entity';
import { JwtPayload } from '../interfaces/jwt-payload.interface';

@Injectable()
export class TokensService {
  constructor(
    @InjectRepository(RefreshToken)
    private refreshTokenRepository: Repository<RefreshToken>,
  ) {}

  validateAccessToken(accessToken: string) {
    try {
      const accessSecret = process.env.JWT_ACCESS_SECRET;
      if (!accessSecret) {
        throw new Error('JWT_ACCESS_SECRET is not defined');
      }
      const userData = jwt.verify(accessToken, accessSecret);
      return userData;
    } catch (error) {
      console.log(error);
      return null;
    }
  }

  validateRefreshToken(refreshToken: string) {
    try {
      const refreshSecret = process.env.JWT_REFRESH_SECRET;
      if (!refreshSecret) {
        throw new Error('JWT_REFRESH_SECRET is not defined');
      }
      const userData = jwt.verify(refreshToken, refreshSecret);
      return userData;
    } catch (error) {
      console.log(error);
      return null;
    }
  }

  generateTokens(payload: JwtPayload) {
    const refreshSecret = process.env.JWT_REFRESH_SECRET;
    const accessSecret = process.env.JWT_ACCESS_SECRET;
    if (!refreshSecret || !accessSecret) {
      throw new Error('JWT_REFRESH_SECRET or JWT_ACCESS_SECRET is not defined');
    }

    const refreshToken = jwt.sign(payload, refreshSecret, {
      expiresIn: '30d',
    });

    const accessToken = jwt.sign(payload, accessSecret, {
      expiresIn: '30m',
    });

    return { accessToken, refreshToken };
  }

  async saveRefreshToken(user: User, refreshToken: string) {
    const tokenData = this.refreshTokenRepository.create({
      user: user,
      token: refreshToken,
    });

    return await this.refreshTokenRepository.save(tokenData);
  }

  async removeToken(refreshToken: string) {
    const tokenData = await this.refreshTokenRepository.delete({
      token: refreshToken,
    });

    return tokenData;
  }

  async findToken(refreshToken: string) {
    const tokenData = await this.refreshTokenRepository.findOne({
      where: { token: refreshToken },
    });

    return tokenData;
  }
}
