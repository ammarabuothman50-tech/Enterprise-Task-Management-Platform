import { Component, computed, input } from '@angular/core';

import { TaskWithUser } from '../models/task.model';

@Component({
  selector: 'app-task-analytics-chart',
  templateUrl: './task-analytics-chart.html',
  styleUrl: './task-analytics-chart.scss',
})
export class TaskAnalyticsChart {
  readonly tasks = input.required<TaskWithUser[]>();

  protected readonly rows = computed(() => {
    const byUser = new Map<string, { name: string; total: number; completed: number }>();

    for (const task of this.tasks()) {
      const name = task.user?.name ?? 'Unknown user';
      const row = byUser.get(name) ?? { name, total: 0, completed: 0 };
      row.total++;
      if (task.completed) row.completed++;
      byUser.set(name, row);
    }

    return [...byUser.values()].map((row) => ({
      ...row,
      percent: Math.round((row.completed / row.total) * 100),
    }));
  });
}
