import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';

import { environment } from '../../core/config/environment';
import { AuthService } from '../../core/services/auth.service';
import { AppButton } from '../../shared/components/button/button';

@Component({
  selector: 'app-home',
  imports: [AppButton],
  templateUrl: './home.html',
  styleUrl: './home.scss',
})
export class Home {
  protected readonly appName = environment.appName;
  protected readonly auth = inject(AuthService);
  protected readonly router = inject(Router);
}
