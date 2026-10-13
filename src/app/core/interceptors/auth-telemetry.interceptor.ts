import { HttpErrorResponse, HttpInterceptorFn, HttpResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { finalize, tap } from 'rxjs';

import { environment } from '../config/environment';
import { AuthService } from '../services/auth.service';

export const authTelemetryInterceptor: HttpInterceptorFn = (req, next) => {
  const token = inject(AuthService).token();
  const request = token ? req.clone({ setHeaders: { Authorization: `Bearer ${token}` } }) : req;

  if (!environment.enableLogging) {
    return next(request);
  }

  const startedAt = performance.now();
  let status: number | string = 'cancelled';

  return next(request).pipe(
    tap({
      next: (event) => {
        if (event instanceof HttpResponse) {
          status = event.status;
        }
      },
      error: (error: HttpErrorResponse) => {
        status = error.status || 'network error';
      },
    }),
    finalize(() => {
      const duration = Math.round(performance.now() - startedAt);
      console.info(`[HTTP] ${request.method} ${request.urlWithParams} → ${status} (${duration}ms)`);
    }),
  );
};
