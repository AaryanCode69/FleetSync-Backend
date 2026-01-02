import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Response } from 'express';

export interface ResponseObj<T> {
  data: T;
  success: boolean;
  statusCode: number;
}

@Injectable()
export class TransformInterceptor<T> implements NestInterceptor<
  T,
  ResponseObj<T>
> {
  intercept(
    context: ExecutionContext,
    next: CallHandler<T>
  ): Observable<ResponseObj<T>> {
    const response = context.switchToHttp().getResponse<Response>();

    return next.handle().pipe(
      map((data) => ({
        statusCode: response.statusCode,
        success: true,
        data: data,
      }))
    );
  }
}
