import { TaskStatusPipe } from './task-status.pipe';

describe('TaskStatusPipe', () => {
  const pipe = new TaskStatusPipe();

  it('formats completed tasks', () => {
    expect(pipe.transform(true)).toBe('COMPLETED');
  });

  it('formats pending tasks', () => {
    expect(pipe.transform(false)).toBe('IN PROGRESS');
  });
});
