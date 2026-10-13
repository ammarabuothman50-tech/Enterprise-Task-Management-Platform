import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';

import { API_CONFIG } from '../../../core/config/api-config.token';
import { Task } from '../models/task.model';
import { User } from '../models/user.model';
import { TaskService } from './task.service';

const API = 'https://api.test';
const tasks: Task[] = [
  { id: 1, userId: 1, title: 'First', completed: false },
  { id: 2, userId: 9, title: 'Second', completed: true },
];
const users = [{ id: 1, name: 'Leanne' }] as User[];

describe('TaskService', () => {
  let service: TaskService;
  let http: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        { provide: API_CONFIG, useValue: { baseUrl: API } },
      ],
    });
    service = TestBed.inject(TaskService);
    http = TestBed.inject(HttpTestingController);
  });

  afterEach(() => http.verify());

  it('loads tasks and attaches their users', () => {
    let result: unknown;
    service.getTasksWithUsers().subscribe((value) => (result = value));

    http.expectOne(`${API}/todos`).flush(tasks);
    http.expectOne(`${API}/users`).flush(users);

    expect(result).toEqual([
      { ...tasks[0], user: users[0] },
      { ...tasks[1], user: null },
    ]);
  });

  it('still returns tasks when users fail to load', () => {
    let result: unknown;
    service.getTasksWithUsers().subscribe((value) => (result = value));

    http.expectOne(`${API}/todos`).flush(tasks);
    http.expectOne(`${API}/users`).flush(null, { status: 500, statusText: 'Server Error' });

    expect(result).toEqual(tasks.map((task) => ({ ...task, user: null })));
  });

  it('sends a PATCH with only the changed fields', () => {
    service.patchTask(1, { completed: true }).subscribe();

    const req = http.expectOne(`${API}/todos/1`);
    expect(req.request.method).toBe('PATCH');
    expect(req.request.body).toEqual({ completed: true });
    req.flush({ ...tasks[0], completed: true });
  });
});
