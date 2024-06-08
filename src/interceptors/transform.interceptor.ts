import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import {
  ClassConstructor,
  ClassTransformOptions,
  plainToClass,
} from 'class-transformer';
import { map, Observable } from 'rxjs';

export interface PaginationData<T> {
  entities: T[];
  meta: {
    page: number;
    offset: number;
    itemCount: number;
    pageCount: number;
  };
}

export interface IResponse<T> {
  message: string;
  data?: T | T[];
  statusCode?: number;
  requestUrl?: string;
}

export interface ResponseWithObject<T> {
  statusCode: number;
  data: T;
  message: string;
}

export interface ResponseWithArray<T> {
  statusCode: number;
  data: T[];
  message: string;
}

export interface ResponseWithPagination<T> {
  statusCode: number;
  data: PaginationData<T>;
  message: string;
}

@Injectable()
export class TransformationInterceptor<T>
  implements NestInterceptor<T, ResponseWithObject<T>>
{
  constructor() {}
  intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Observable<ResponseWithObject<T>> {
    const ctx = context.switchToHttp();
    const response = ctx.getResponse();
    const { statusCode } = response;
    return next.handle().pipe(
      map((responseData: IResponse<T>) => {
        return {
          message: responseData.message || '',
          statusCode: statusCode,
          date: new Date().toISOString(),
          data: responseData.data as T,
        };
      }),
    );
  }
}

@Injectable()
export class TransformationInterceptorArray<T>
  implements NestInterceptor<T, ResponseWithArray<T>>
{
  constructor() {}
  intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Observable<ResponseWithArray<T>> {
    const ctx = context.switchToHttp();
    const response = ctx.getResponse();
    const { statusCode } = response;
    return next.handle().pipe(
      map((responseData: IResponse<T>) => {
        return {
          message: responseData.message || '',
          statusCode: statusCode,
          date: new Date().toISOString(),
          data: responseData.data as T[],
        };
      }),
    );
  }
}

@Injectable()
export class TransformationInterceptorPagination<T>
  implements NestInterceptor<T, ResponseWithPagination<T>>
{
  constructor() {}
  intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Observable<ResponseWithPagination<T>> {
    const ctx = context.switchToHttp();
    const response = ctx.getResponse();
    const { statusCode } = response;
    return next.handle().pipe(
      map((responseData: IResponse<PaginationData<T>>) => {
        return {
          message: responseData.message || '',
          statusCode: statusCode,
          date: new Date().toISOString(),
          data: responseData.data as PaginationData<T>,
        };
      }),
    );
  }
}
