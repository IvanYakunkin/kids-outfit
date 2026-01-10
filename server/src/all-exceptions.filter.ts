import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
} from '@nestjs/common';
import { Response } from 'express';

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();

    if (exception instanceof HttpException) {
      const status = exception.getStatus();
      const message = exception.getResponse();

      return response.status(status).json({
        statusCode: status,
        message: message,
      });
    }

    return response.status(500).json({
      statusCode: 500,
      message: 'Internal server error',
    });
  }
}
