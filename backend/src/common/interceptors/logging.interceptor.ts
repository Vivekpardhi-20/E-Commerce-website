import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable, tap } from 'rxjs';

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const req = context.switchToHttp().getRequest();
    const method = req.method;
    const url = req.url;
    const body = req.body;
    const user = req.user;

    console.log(`[Request] ${method} ${url}`);
    console.log('Body:', body);
    console.log('User:', user);

    const now = Date.now();
    return next
      .handle()
      .pipe(
        tap((data) =>
          console.log(
            `[Response] ${method} ${url} - ${Date.now() - now}ms`,
            'Response:',
            data,
          ),
        ),
      );
  }
}