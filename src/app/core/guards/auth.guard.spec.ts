import { TestBed } from '@angular/core/testing';
import {
  ActivatedRouteSnapshot,
  provideRouter,
  Router,
  RouterStateSnapshot,
  UrlTree,
} from '@angular/router';

import { AuthService } from '../services/auth.service';
import { authGuard } from './auth.guard';

describe('authGuard', () => {
  const runGuard = () =>
    TestBed.runInInjectionContext(() =>
      authGuard({} as ActivatedRouteSnapshot, {} as RouterStateSnapshot),
    );

  beforeEach(() => {
    localStorage.clear();
    TestBed.configureTestingModule({ providers: [provideRouter([])] });
  });

  it('redirects to /home when logged out', () => {
    const result = runGuard() as UrlTree;
    expect(TestBed.inject(Router).serializeUrl(result)).toBe('/home');
  });

  it('allows access when logged in', () => {
    TestBed.inject(AuthService).login();
    expect(runGuard()).toBe(true);
  });
});
