import { HttpStatus } from '@nestjs/common';
import { ApiResponseOptions } from '@nestjs/swagger';
import { ApiErrorDecorator } from './error.decorator';

interface ErrorObject {
  message: string;
  description?: string;
  statusCode?: HttpStatus;
}

export function ApiBadRequest(
  args: ErrorObject[] | ErrorObject,
  options?: ApiResponseOptions,
) {
  if (Array.isArray(args)) {
    args = args.map((item) => ({
      statusCode: HttpStatus.BAD_REQUEST,
      message: item.message,
      description: item.description,
    }));
  } else {
    args = {
      statusCode: HttpStatus.BAD_REQUEST,
      message: args.message,
      description: args.description,
    } as ErrorObject;
  }

  return ApiErrorDecorator(args, options);
}

export function ApiInternalError(
  message: string,
  description?: string,
  options?: ApiResponseOptions,
) {
  return ApiErrorDecorator(
    {
      statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
      message,
      description,
    },
    options,
  );
}

export function ApiNotFound(
  args: ErrorObject[] | ErrorObject,
  options?: ApiResponseOptions,
) {
  if (Array.isArray(args)) {
    args = args.map((item) => ({
      statusCode: HttpStatus.NOT_FOUND,
      message: item.message,
      description: item.description,
    }));
  } else {
    args = {
      statusCode: HttpStatus.NOT_FOUND,
      message: args.message,
      description: args.description,
    } as ErrorObject;
  }

  return ApiErrorDecorator(args, options);
}

export function ApiUnauthorized(
  message: string,
  description?: string,
  options?: ApiResponseOptions,
) {
  return ApiErrorDecorator(
    {
      statusCode: HttpStatus.UNAUTHORIZED,
      message,
      description: description || message,
    },
    options,
  );
}
