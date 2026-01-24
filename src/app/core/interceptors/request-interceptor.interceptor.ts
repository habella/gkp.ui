import { HttpInterceptorFn } from '@angular/common/http';
import { environment } from './../../../environments/environment.development';

export const requestInterceptor: HttpInterceptorFn = (req, next) => {
  if (req.url.endsWith('.json')) {
    return next(req);
  }

  if (!req.url.startsWith('.') && !req.url.startsWith('http')) {
    req = req.clone({
      url: `${environment.apiUrl}/${req.url}`,
    });
  }

  return next(req);
};
