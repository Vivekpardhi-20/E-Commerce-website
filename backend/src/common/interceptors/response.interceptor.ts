
import { Injectable, NestInterceptor, ExecutionContext, CallHandler, HttpException } from '@nestjs/common';
import { Observable } from 'rxjs';
import { map, catchError } from 'rxjs/operators';

@Injectable()
export class ResponseInterceptor implements NestInterceptor {
	intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
		return next.handle().pipe(
			map((data) => ({
				statuscode: 200,
				data,
				message: 'Success',
				feildErrors: [],
				error: false,
			})),
			catchError((err) => {
				let statuscode = 500;
				let message = 'Internal Server Error';
				let feildErrors = [];
				if (err instanceof HttpException) {
					statuscode = err.getStatus();
					const response = err.getResponse();
					if (typeof response === 'object' && response !== null) {
						message = response['message'] || message;
						feildErrors = response['feildErrors'] || [];
					} else if (typeof response === 'string') {
						message = response;
					}
				}
				return [
					{
						statuscode,
						data: null,
						message,
						feildErrors,
						error: true,
					},
				];
			})
		);
	}
}
