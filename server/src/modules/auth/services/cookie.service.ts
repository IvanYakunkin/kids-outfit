import { UnauthorizedException } from '@nestjs/common';
import { Request, Response } from 'express';

export class CookieService {
  static setRefreshToken(res: Response, token: string) {
    res.cookie('refresh_token', token, {
      httpOnly: true,
      secure: true,
      sameSite: 'strict',
      maxAge: 30 * 24 * 60 * 60 * 1000,
    });
  }

  static getRefreshToken(req: Request): string {
    const token = req.cookies['refresh_token'];
    if (!token) {
      throw new UnauthorizedException('Токен авторизации не обнаружен');
    }

    return token;
  }

  static clearRefreshToken(res: Response) {
    res.clearCookie('refresh_token');
  }
}
