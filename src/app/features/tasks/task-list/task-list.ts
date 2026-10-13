import { NgStyle } from '@angular/common';
import { Component, computed, effect, inject, signal } from '@angular/core';
import { toObservable, toSignal } from '@angular/core/rxjs-interop';
import { FormsModule } from '@angular/forms';
import { InputText } from 'primeng/inputtext';
import { MultiSelect } from 'primeng/multiselect';
import { debounceTime, distinctUntilChanged } from 'rxjs';

import { NotificationService } from '../../../core/services/notification.service';
import { AppButton } from '../../../shared/components/button/button';
import { Modal } from '../../../shared/components/modal/modal';
import { TaskFilter, TaskWithUser } from '../models/task.model';
import { User } from '../models/user.model';
import { TaskService } from '../services/task.service';
import { TaskAnalyticsChart } from '../task-analytics-chart/task-analytics-chart';
import { TaskCard } from '../task-card/task-card';

const FILTER_KEY = 'tasks.filter';

const FILTERS: { value: TaskFilter; label: string }[] = [
  { value: 'all', label: 'All' },
  { value: 'completed', label: 'Completed' },
  { value: 'pending', label: 'Pending' },
];

@Component({
  selector: 'app-task-list',
  imports: [
    NgStyle,
    FormsModule,
    InputText,
    MultiSelect,
    AppButton,
    Modal,
    TaskAnalyticsChart,
    TaskCard,
  ],
  templateUrl: './task-list.html',
  styleUrl: './task-list.scss',
})
export class TaskList {
  private readonly taskService = inject(TaskService);
  private readonly notifications = inject(NotificationService);

  protected readonly filters = FILTERS;

  protected readonly tasks = signal<TaskWithUser[]>([]);
  protected readonly loaded = signal(false);
  protected readonly error = signal(false);
  protected readonly filter = signal<TaskFilter>(savedFilter());
  protected readonly query = signal('');
  protected readonly selectedUserIds = signal<number[]>([]);
  protected readonly taskToDelete = signal<TaskWithUser | null>(null);

  private readonly searchTerm = toSignal(
    toObservable(this.query).pipe(debounceTime(300), distinctUntilChanged()),
    { initialValue: '' },
  );

  protected readonly users = computed(() => {
    const usersById = new Map<number, User>();
    for (const task of this.tasks()) {
      if (task.user) usersById.set(task.user.id, task.user);
    }
    return [...usersById.values()];
  });

  protected readonly totalCount = computed(() => this.tasks().length);
  protected readonly completedCount = computed(
    () => this.tasks().filter((t) => t.completed).length,
  );
  protected readonly progress = computed(() =>
    this.totalCount() ? Math.round((this.completedCount() / this.totalCount()) * 100) : 0,
  );

  protected readonly filteredTasks = computed(() => {
    const filter = this.filter();
    const term = this.searchTerm().trim().toLowerCase();
    const userIds = this.selectedUserIds();

    return this.tasks().filter(
      (task) =>
        (filter === 'all' || task.completed === (filter === 'completed')) &&
        (!userIds.length || userIds.includes(task.userId)) &&
        task.title.toLowerCase().includes(term),
    );
  });

  constructor() {
    effect(() => localStorage.setItem(FILTER_KEY, this.filter()));
    this.load();
  }

  protected load(): void {
    this.error.set(false);
    this.taskService.getTasksWithUsers().subscribe({
      next: (tasks) => {
        this.tasks.set(tasks);
        this.loaded.set(true);
      },
      error: () => this.error.set(true),
    });
  }

  protected toggleStatus(task: TaskWithUser): void {
    this.taskService.patchTask(task.id, { completed: !task.completed }).subscribe({
      next: () => {
        this.tasks.update((tasks) =>
          tasks.map((t) => (t.id === task.id ? { ...t, completed: !t.completed } : t)),
        );
        this.notifications.show('Task updated');
      },
      error: () => this.notifications.show('Could not update task', 'error'),
    });
  }

  protected deleteTask(): void {
    const task = this.taskToDelete();
    if (!task) return;

    this.taskToDelete.set(null);
    this.taskService.deleteTask(task.id).subscribe({
      next: () => {
        this.tasks.update((tasks) => tasks.filter((t) => t.id !== task.id));
        this.notifications.show('Task deleted');
      },
      error: () => this.notifications.show('Could not delete task', 'error'),
    });
  }
}

function savedFilter(): TaskFilter {
  const saved = localStorage.getItem(FILTER_KEY);
  return FILTERS.some((f) => f.value === saved) ? (saved as TaskFilter) : 'all';
}
