// app/types/todo.ts

export type Priority = "low" | "medium" | "high";
export type Status = "backlog" | "today" | "upcoming" | "completed";
export type ViewMode = "list" | "board";

export interface Todo {
  $id: string;
  title: string;
  description: string;
  dueDate?: string;
  priority: Priority;
  status: Status;
  parentId?: string | null;
  userId: string;
  createdAt: string;
  order: number;
  subtasks?: Todo[];
}

export interface CreateTodoInput {
  title: string;
  description?: string;
  dueDate?: string;
  priority: Priority;
  parentId?: string;
}

export interface UpdateTodoInput {
  title?: string;
  description?: string;
  dueDate?: string;
  priority?: Priority;
  status?: Status;
  order?: number;
}

export interface User {
  $id: string;
  email: string;
  name?: string;
}
