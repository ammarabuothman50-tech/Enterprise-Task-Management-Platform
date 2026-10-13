import { inject } from '@angular/core';
import { RedirectCommand, ResolveFn, Router } from '@angular/router';
import { catchError, of } from 'rxjs';

import { TaskWithUser } from './models/task.model';
import { TaskService } from './services/task.service';

export const taskResolver: ResolveFn<TaskWithUser> = (route) => {
  const router = inject(Router);
  const id = Number(route.paramMap.get('id'));

  return inject(TaskService)
    .getTaskWithUser(id)
    .pipe(catchError(() => of(new RedirectCommand(router.parseUrl('/not-found')))));
};
