import { HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';

export function handleHttpError(operation: string) {
  return (error: HttpErrorResponse): Observable<never> => {
    console.error(`${operation} failed`, error);
    return throwError(() => new Error(`${operation} failed (${error.status || 'network error'})`));
  };
}
