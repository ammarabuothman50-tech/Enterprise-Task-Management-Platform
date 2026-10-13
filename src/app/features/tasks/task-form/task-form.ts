import { Component, inject, input, OnInit, signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { NonNullableFormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Checkbox } from 'primeng/checkbox';
import { catchError, of } from 'rxjs';

import { NotificationService } from '../../../core/services/notification.service';
import { AppButton } from '../../../shared/components/button/button';
import { AppDropdown } from '../../../shared/components/dropdown/dropdown';
import { AppInput } from '../../../shared/components/input/input';
import { TaskWithUser } from '../models/task.model';
import { User } from '../models/user.model';
import { noBuzzwords } from '../no-buzzwords.validator';
import { TaskService } from '../services/task.service';
import { UserService } from '../services/user.service';

@Component({
  selector: 'app-task-form',
  imports: [ReactiveFormsModule, Checkbox, AppButton, AppDropdown, AppInput],
  templateUrl: './task-form.html',
  styleUrl: './task-form.scss',
})
export class TaskForm implements OnInit {
  private readonly taskService = inject(TaskService);
  private readonly notifications = inject(NotificationService);
  protected readonly router = inject(Router);

  readonly task = input<TaskWithUser>();

  protected readonly users = toSignal(
    inject(UserService)
      .getUsers()
      .pipe(catchError(() => of<User[]>([]))),
    { initialValue: [] },
  );

  protected readonly saving = signal(false);

  protected readonly form = inject(NonNullableFormBuilder).group({
    title: ['', [Validators.required, noBuzzwords]],
    userId: [null as number | null, Validators.required],
    completed: [false],
  });

  ngOnInit(): void {
    const task = this.task();
    if (task) this.form.patchValue(task);
  }

  protected save(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const { title, userId, completed } = this.form.getRawValue();
    const data = { title: title.trim(), userId: userId!, completed };
    const task = this.task();

    const request = task
      ? this.taskService.updateTask({ ...data, id: task.id })
      : this.taskService.createTask(data);

    this.saving.set(true);
    request.subscribe({
      next: () => {
        this.notifications.show(task ? 'Task updated' : 'Task created');
        this.router.navigate(['/tasks']);
      },
      error: () => {
        this.saving.set(false);
        this.notifications.show('Could not save task', 'error');
      },
    });
  }
}
