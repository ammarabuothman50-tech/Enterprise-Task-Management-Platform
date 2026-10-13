import { computed, effect, Injectable, signal } from '@angular/core';

const APP_TOKEN = 'app_token';
const LOGGED_IN_KEY = 'auth.loggedIn';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly loggedIn = signal(localStorage.getItem(LOGGED_IN_KEY) === 'true');

  readonly isLoggedIn = this.loggedIn.asReadonly();
  readonly token = computed(() => (this.loggedIn() ? APP_TOKEN : null));

  constructor() {
    effect(() => localStorage.setItem(LOGGED_IN_KEY, String(this.loggedIn())));
  }

  login(): void {
    this.loggedIn.set(true);
  }

  toggle(): void {
    this.loggedIn.update((value) => !value);
  }
}
