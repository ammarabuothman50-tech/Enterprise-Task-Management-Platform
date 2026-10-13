import { User } from './user.model';

export interface Task {
  id: number;
  userId: number;
  title: string;
  completed: boolean;
}

export interface TaskWithUser extends Task {
  user: User | null;
}

export type CreateTaskDto = Omit<Task, 'id'>;

export type UpdateTaskDto = Partial<CreateTaskDto>;

export type TaskFilter = 'all' | 'completed' | 'pending';
