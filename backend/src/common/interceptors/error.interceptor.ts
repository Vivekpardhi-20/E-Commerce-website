import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

@Injectable()
export class ErrorInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    return next.handle().pipe(
      catchError((err) => {
        // Customize error response structure here
        return throwError(() => ({
          statusCode: err.status || 500,
          message: err.message || 'Internal server error',
          error: err.name || 'Error',
          feildErrors: err.feildErrors || undefined,
        }));
      })
    );
  }
}
