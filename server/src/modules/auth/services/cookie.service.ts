import { UnauthorizedException } from '@nestjs/common';
import { Request, Response } from 'express';

export class CookieService {
  static setRefreshToken(res: Response, token: string) {
    res.cookie('refresh_token', token, {
      httpOnly: true,
      secure: false,
      path: '/',
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });
  }

  static setAccessToken(res: Response, token: string) {
    res.cookie('access_token', token, {
      httpOnly: true,
      secure: false,
      path: '/',
      sameSite: 'lax',
      maxAge: 15 * 60 * 1000,
    });
  }

  static getRefreshToken(req: Request): string {
    const token = req.cookies['refresh_token'];
    if (!token) {
      throw new UnauthorizedException('Вы не авторизованы');
    }

    return token;
  }

  static clearRefreshToken(res: Response) {
    res.clearCookie('refresh_token');
  }

  static clearAccessToken(res: Response) {
    res.clearCookie('access_token');
  }
}
