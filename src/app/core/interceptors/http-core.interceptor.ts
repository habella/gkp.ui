import { HttpInterceptorFn } from '@angular/common/http';
import { HttpRequest, HttpHandlerFn } from '@angular/common/http';

export const httpCoreInterceptor: HttpInterceptorFn = (req: HttpRequest<unknown>, next: HttpHandlerFn) => {
  let modifiedReq = req;

  if (req.url.includes('/api/v1/image/')) {
    modifiedReq = req.clone({
      responseType: 'blob' as 'json'
    });
  }

  return next(modifiedReq);
};
