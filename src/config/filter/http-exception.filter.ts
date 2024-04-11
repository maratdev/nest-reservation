import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
} from '@nestjs/common';
import { Request, Response } from 'express';

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();
    const status = exception.getStatus();
    const exceptionResponse = exception.getResponse();
    const message =
      typeof exceptionResponse === 'object'
        ? exceptionResponse['message']
        : exceptionResponse;
    response.status(status).json({
      statusCode: status,
      message,
      timestamp: new Date().toLocaleString(),
      path: request.url,
      method: request.method,
      host: request.hostname,
    });
  }
}
