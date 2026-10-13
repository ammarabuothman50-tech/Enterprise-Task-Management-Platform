import { afterNextRender, Component, inject, viewChild, ViewContainerRef } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';

import { environment } from './core/config/environment';
import { AuthService } from './core/services/auth.service';
import { LoadingService } from './core/services/loading.service';
import { NotificationService } from './core/services/notification.service';
import { AppButton } from './shared/components/button/button';
import { AppSpinner } from './shared/components/spinner/spinner';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, RouterLink, RouterLinkActive, AppButton, AppSpinner],
  templateUrl: './app.html',
  styleUrl: './app.scss',
})
export class App {
  protected readonly appName = environment.appName;
  protected readonly auth = inject(AuthService);
  protected readonly loading = inject(LoadingService);

  private readonly toastHost = viewChild.required('toastHost', { read: ViewContainerRef });

  constructor() {
    const notifications = inject(NotificationService);
    afterNextRender(() => notifications.setHost(this.toastHost()));
  }
}
