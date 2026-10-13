import { Routes } from '@angular/router';

import { authGuard } from '../../core/guards/auth.guard';
import { taskResolver } from './task.resolver';

export const TASK_ROUTES: Routes = [
  {
    path: '',
    title: 'Tasks',
    loadComponent: () => import('./task-list/task-list').then((m) => m.TaskList),
  },
  {
    path: 'new',
    title: 'New task',
    canActivate: [authGuard],
    loadComponent: () => import('./task-form/task-form').then((m) => m.TaskForm),
  },
  {
    path: ':id',
    title: 'Task details',
    resolve: { task: taskResolver },
    loadComponent: () => import('./task-detail/task-detail').then((m) => m.TaskDetail),
  },
  {
    path: ':id/edit',
    title: 'Edit task',
    canActivate: [authGuard],
    resolve: { task: taskResolver },
    loadComponent: () => import('./task-form/task-form').then((m) => m.TaskForm),
  },
];
