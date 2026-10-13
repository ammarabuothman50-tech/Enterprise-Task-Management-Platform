import { NgClass } from '@angular/common';
import { Component, inject, input } from '@angular/core';
import { Router } from '@angular/router';

import { AuthService } from '../../../core/services/auth.service';
import { AppButton } from '../../../shared/components/button/button';
import { TaskStatusPipe } from '../../../shared/pipes/task-status.pipe';
import { TaskWithUser } from '../models/task.model';

@Component({
  selector: 'app-task-detail',
  imports: [NgClass, AppButton, TaskStatusPipe],
  templateUrl: './task-detail.html',
  styleUrl: './task-detail.scss',
})
export class TaskDetail {
  readonly task = input.required<TaskWithUser>();
  protected readonly auth = inject(AuthService);
  protected readonly router = inject(Router);
}
