import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpStatus,
} from '@nestjs/common';
import { MongoError } from 'mongodb';
import { Request, Response } from 'express';

@Catch(MongoError)
export class MongoExceptionFilter implements ExceptionFilter {
  catch(exception: MongoError, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();
    const exceptionResponse = exception;
    const message =
      typeof exceptionResponse === 'object'
        ? exceptionResponse['message']
        : exceptionResponse;
    response.status(409).json({
      statusCode: HttpStatus.CONFLICT,
      timestamp: new Date().toLocaleString(),
      message,
      path: request.url,
      method: request.method,
      host: request.hostname,
    });
  }
}
