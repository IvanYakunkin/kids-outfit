import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Request } from 'express';
import { JwtPayload } from 'jsonwebtoken';
import { TokensService } from '../services/token.service';

declare module 'express' {
  export interface Request {
    user?: string | JwtPayload | null;
  }
}

@Injectable()
export class JwtAuthGuard implements CanActivate {
  constructor(private tokenService: TokensService) {}
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context
      .switchToHttp()
      .getRequest<Request & { user?: any }>();

    const authHeader = request.headers['authorization'];
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw new UnauthorizedException('Вы не авторизованы');
    }

    const token = authHeader.split(' ')[1];

    const userData = await this.tokenService.validateAccessToken(token);

    if (!userData) {
      throw new UnauthorizedException('Пользователь не авторизован');
    }

    request.user = userData;

    return true;
  }
}
