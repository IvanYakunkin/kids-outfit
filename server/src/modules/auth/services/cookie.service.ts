import { UnauthorizedException } from '@nestjs/common';
import { randomBytes } from 'crypto';
import { Request, Response } from 'express';

export class CookieService {
  static setRefreshToken(res: Response, token: string) {
    res.cookie('refresh_token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      path: '/',
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });
  }

  static setAccessToken(res: Response, token: string) {
    res.cookie('access_token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      path: '/',
      sameSite: 'lax',
      maxAge: 15 * 60 * 1000,
    });
  }

  static setCsrfToken(res: Response) {
    const csrfToken = randomBytes(32).toString('hex');
    res.cookie('XSRF-TOKEN', csrfToken, {
      httpOnly: false,
      sameSite: 'lax',
      secure: process.env.NODE_ENV === 'production',
      path: '/',
      maxAge: 15 * 60 * 1000,
    });
    return csrfToken;
  }

  static getRefreshToken(req: Request): string {
    const token = req.cookies['refresh_token'];
    if (!token) {
      throw new UnauthorizedException('Вы не авторизованы');
    }

    return token;
  }

  static getAccessToken(req: Request): string {
    const token = req.cookies['access_token'];

    if (!token) {
      throw new UnauthorizedException('Вы не авторизованы');
    }

    return token;
  }

  static clearRefreshToken(res: Response) {
    res.clearCookie('refresh_token');
  }

  static clearCsrfTokne(res: Response) {
    res.clearCookie('XSRF-TOKEN');
  }

  static clearAccessToken(res: Response) {
    res.clearCookie('access_token');
  }
}
