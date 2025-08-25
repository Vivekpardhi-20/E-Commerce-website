import {
	Injectable,
	NestInterceptor,
	ExecutionContext,
	CallHandler,
	HttpException,
	ArgumentsHost,
	Catch,
} from '@nestjs/common';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

@Injectable()
export class ErrorInterceptor implements NestInterceptor {
	intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
		return next.handle().pipe(
			catchError((err) => {
				if (err instanceof HttpException) {
					const response = err.getResponse();
					return throwError(() => ({
						statusCode: err.getStatus(),
						error: typeof response === 'string' ? response : response['error'] || err.message,
						message: typeof response === 'string' ? response : response['message'] || err.message,
						feildErrors: response['feildErrors'] || undefined,
					}));
				}
				return throwError(() => ({
					statusCode: 500,
					error: 'Internal Server Error',
					message: err.message || 'Unexpected error occurred',
				}));
			})
		);
	}
}
