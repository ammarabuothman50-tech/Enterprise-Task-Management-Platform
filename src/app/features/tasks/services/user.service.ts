import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { catchError, Observable } from 'rxjs';

import { API_CONFIG } from '../../../core/config/api-config.token';
import { handleHttpError } from '../../../core/utils/handle-http-error';

import { User } from '../models/user.model';

@Injectable({ providedIn: 'root' })
export class UserService {
  private readonly http = inject(HttpClient);
  private readonly url = `${inject(API_CONFIG).baseUrl}/users`;

  getUsers(): Observable<User[]> {
    return this.http.get<User[]>(this.url).pipe(catchError(handleHttpError('Load users')));
  }

  getUserById(id: number): Observable<User> {
    return this.http
      .get<User>(`${this.url}/${id}`)
      .pipe(catchError(handleHttpError(`Load user ${id}`)));
  }
}
