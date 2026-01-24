import {
  HttpErrorResponse,
  HttpHandlerFn,
  HttpInterceptorFn,
  HttpRequest,
} from '@angular/common/http';
import { catchError, throwError } from 'rxjs';

export const httpErrorInterceptor: HttpInterceptorFn = (
  req: HttpRequest<unknown>,
  next: HttpHandlerFn
) => {
  return next(req).pipe(
    catchError((error: HttpErrorResponse) => {
      let errorMsg = '';

      if (error.status === 401) {
        errorMsg = 'Authentication error';
        // Handle authentication error here
      }

      if (error.status === 403) {
        errorMsg = 'Authorization error';
        // Handle authorization error here
      }

      if (error.error instanceof ErrorEvent) {
        errorMsg = `Client Error: ${error.error.message}`;
      } else {
        errorMsg = `Server Error Code: ${error.status}, Message: ${error.message}`;
      }

      console.log(errorMsg);
      return throwError(() => errorMsg);
    })
  );
};
