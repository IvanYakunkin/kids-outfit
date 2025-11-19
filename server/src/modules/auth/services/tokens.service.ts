import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import * as jwt from 'jsonwebtoken';
import { createHash } from 'node:crypto';
import { User } from 'src/modules/users/entities/user.entity';
import { DeepPartial, Repository } from 'typeorm';
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
        throw new Error('JWT_ACCESS_SECRET не определен');
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
        throw new Error('JWT_REFRESH_SECRET не определен');
      }
      const userData = jwt.verify(refreshToken, refreshSecret);
      return userData;
    } catch (error) {
      console.log(error);
      return null;
    }
  }

  hashToken(token: string) {
    return createHash('sha256').update(token).digest('hex');
  }

  // Used to refresh access token token
  generateAccessToken(payload: JwtPayload) {
    const accessSecret = process.env.JWT_ACCESS_SECRET;
    if (!accessSecret) {
      throw new Error('JWT_ACCESS_SECRET не определен');
    }

    const accessToken = jwt.sign(payload, accessSecret, {
      expiresIn: '30m',
    });

    return accessToken;
  }

  generateTokens(payload: JwtPayload) {
    const refreshSecret = process.env.JWT_REFRESH_SECRET;
    const accessSecret = process.env.JWT_ACCESS_SECRET;
    if (!refreshSecret || !accessSecret) {
      throw new Error('JWT_REFRESH_SECRET/JWT_ACCESS_SECRET не определены');
    }

    const refreshToken = jwt.sign(payload, refreshSecret, {
      expiresIn: '7d',
    });

    const accessToken = jwt.sign(payload, accessSecret, {
      expiresIn: '15m',
    });

    return { accessToken, refreshToken };
  }

  async saveRefreshToken(
    user: User,
    refreshToken: string,
    ip?: string,
    userAgent?: string,
  ) {
    const tokenData: DeepPartial<RefreshToken> = {
      user: user,
      tokenHash: refreshToken,
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      ip: ip ?? undefined,
      userAgent: userAgent ?? undefined,
    };

    return await this.refreshTokenRepository.save(tokenData);
  }

  async removeToken(tokenInDb: RefreshToken) {
    const tokenData = await this.refreshTokenRepository.remove(tokenInDb);

    return tokenData;
  }

  async findToken(hashedToken: string) {
    const tokenData = await this.refreshTokenRepository.findOne({
      where: { tokenHash: hashedToken },
      relations: ['user'],
    });

    return tokenData;
  }
}
