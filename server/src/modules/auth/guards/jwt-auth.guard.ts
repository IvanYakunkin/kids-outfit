import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Request } from 'express';
import { JwtPayload } from 'jsonwebtoken';
import { TokensService } from '../services/tokens.service';

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
      .getRequest<Request & { user?: JwtPayload }>();

    const token = request.cookies['access_token'];

    if (!token) {
      throw new UnauthorizedException('Вы не авторизованы');
    }

    const userData = await this.tokenService.validateAccessToken(token);

    if (!userData || typeof userData === 'string') {
      throw new UnauthorizedException('Пользователь не авторизован');
    }

    request.user = userData;
    return true;
  }
}
