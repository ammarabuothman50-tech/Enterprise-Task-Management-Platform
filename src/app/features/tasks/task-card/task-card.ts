import { NgClass } from '@angular/common';
import { Component, input, output } from '@angular/core';
import { RouterLink } from '@angular/router';

import { AppButton } from '../../../shared/components/button/button';
import { HighlightPriorityDirective } from '../../../shared/directives/highlight-priority.directive';
import { TaskStatusPipe } from '../../../shared/pipes/task-status.pipe';
import { TaskWithUser } from '../models/task.model';

@Component({
  selector: 'app-task-card',
  imports: [NgClass, RouterLink, AppButton, HighlightPriorityDirective, TaskStatusPipe],
  templateUrl: './task-card.html',
  styleUrl: './task-card.scss',
})
export class TaskCard {
  readonly task = input.required<TaskWithUser>();
  readonly toggle = output<TaskWithUser>();
  readonly remove = output<TaskWithUser>();
}
