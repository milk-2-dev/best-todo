import type { Todos, TodosStatus } from "./appwrite";

export type Priority = "low" | "medium" | "high";
export type Status = "backlog" | "today" | "upcoming" | "completed";
export type ViewMode = "list" | "board";

export interface Todo extends Todos {
  $id: string;
  $createdAt: string;
}

export interface TodoNode extends Todo {
  subtasks: TodoNode[];
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
