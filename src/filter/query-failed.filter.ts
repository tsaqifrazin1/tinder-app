import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { STATUS_CODES } from 'http';
import { QueryFailedError } from 'typeorm';

import { ConstraintErrors } from './constraint-errors';
import { IResponse } from 'src/interceptors';
import { Request, Response } from 'express';

@Catch(QueryFailedError)
export class QueryFailedFilter implements ExceptionFilter {
  private readonly logger = new Logger(QueryFailedError.name);

  constructor(public reflector: Reflector) {}

  catch(exception: any, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    const message = ConstraintErrors[exception.constraint];

    const status =
      HttpStatus.CONFLICT;

    const responseObject: IResponse<void> = {
      message: message ?? exception.message,
      statusCode: Number(status),
      requestUrl: request.originalUrl,
    };

    this.logger.error(exception.message, exception.stack);

    response.status(status).json(responseObject);
  }
}
