import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
  BadRequestException,
  Logger,
} from '@nestjs/common';
import { AxiosError } from 'axios';
import { Request, Response } from 'express';
import { IResponse } from 'src/interceptors';
import { QueryFailedError } from 'typeorm';

@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(HttpExceptionFilter.name);
  catch(exception: Error, host: ArgumentsHost) {
    const context = host.switchToHttp();
    const response = context.getResponse<Response>();
    const request = context.getRequest<Request>();

    let status: number, code: number = 500;

    switch (true) {
      case exception instanceof BadRequestException:
        code = (exception as any)?.response?.statusCode;
        status = (exception as BadRequestException).getStatus();
        break;
      case exception instanceof HttpException:
        code = (exception as any)?.response?.statusCode;
        status = (exception as HttpException).getStatus();
        break;
      case exception instanceof AxiosError:
        code = (exception as AxiosError)?.response?.status ?? 400;
        status = HttpStatus.BAD_REQUEST;
        break;
      default:
        status = HttpStatus.INTERNAL_SERVER_ERROR;
        break;
    }
    let message;
    switch (true) {
      case (exception as any).response &&
        (exception as any).response.message?.length > 0:
        message = (exception as any).response.message;
        break;
      case exception instanceof AxiosError:
        message = (exception as any)?.response?.data?.message;
        break;
      default:
        message = exception.message;
        break;
    }

    const responseObject: IResponse<void> = {
      message,
      statusCode: Number(code ?? status),
      requestUrl: request.originalUrl,
    };

    this.logger.error(exception.message, exception.stack);

    response.status(status).json(responseObject);
  }
}
