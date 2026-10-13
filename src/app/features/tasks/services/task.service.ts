import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { catchError, forkJoin, map, Observable, of, switchMap } from 'rxjs';

import { API_CONFIG } from '../../../core/config/api-config.token';
import { handleHttpError } from '../../../core/utils/handle-http-error';

import { CreateTaskDto, Task, TaskWithUser, UpdateTaskDto } from '../models/task.model';
import { User } from '../models/user.model';
import { UserService } from './user.service';

@Injectable({ providedIn: 'root' })
export class TaskService {
  private readonly http = inject(HttpClient);
  private readonly userService = inject(UserService);
  private readonly url = `${inject(API_CONFIG).baseUrl}/todos`;

  getTasks(): Observable<Task[]> {
    return this.http.get<Task[]>(this.url).pipe(catchError(handleHttpError('Load tasks')));
  }

  getTaskById(id: number): Observable<Task> {
    return this.http
      .get<Task>(`${this.url}/${id}`)
      .pipe(catchError(handleHttpError(`Load task ${id}`)));
  }

  getTasksWithUsers(): Observable<TaskWithUser[]> {
    return forkJoin({
      tasks: this.getTasks(),
      users: this.userService.getUsers().pipe(catchError(() => of<User[]>([]))),
    }).pipe(map(({ tasks, users }) => attachUsers(tasks, users)));
  }

  getTaskWithUser(id: number): Observable<TaskWithUser> {
    return this.getTaskById(id).pipe(
      switchMap((task) =>
        this.userService.getUserById(task.userId).pipe(
          map((user) => ({ ...task, user })),
          catchError(() => of({ ...task, user: null })),
        ),
      ),
    );
  }

  createTask(task: CreateTaskDto): Observable<Task> {
    return this.http.post<Task>(this.url, task).pipe(catchError(handleHttpError('Create task')));
  }

  updateTask(task: Task): Observable<Task> {
    return this.http
      .put<Task>(`${this.url}/${task.id}`, task)
      .pipe(catchError(handleHttpError(`Update task ${task.id}`)));
  }

  patchTask(id: number, changes: UpdateTaskDto): Observable<Task> {
    return this.http
      .patch<Task>(`${this.url}/${id}`, changes)
      .pipe(catchError(handleHttpError(`Update task ${id}`)));
  }

  deleteTask(id: number): Observable<void> {
    return this.http
      .delete<void>(`${this.url}/${id}`)
      .pipe(catchError(handleHttpError(`Delete task ${id}`)));
  }
}

function attachUsers(tasks: Task[], users: User[]): TaskWithUser[] {
  const usersById = new Map(users.map((user) => [user.id, user]));
  return tasks.map((task) => ({ ...task, user: usersById.get(task.userId) ?? null }));
}
