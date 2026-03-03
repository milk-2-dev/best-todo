import type { Todos } from "./appwrite";

export type Priority = "low" | "medium" | "high";
export type ViewMode = "list" | "board";

export interface TodoNode extends Todos {
  subtasks: TodoNode[];
}

export enum TodosStatus {
  BACKLOG = "backlog",
  TODAY = "today",
  UPCOMING = "upcoming",
  COMPLETED = "completed"
}

export type TaskFormIntent = "create" | "update" | "delete" | "toggleComplete";

export interface TaskFormData {
  intent: TaskFormIntent;
  title: string;
  description: string | null;
  completed: boolean;
  priority: Priority;
  dueDate: string | null;
  subtasks: TodoNode[];
}

export interface CreateTodoPayload extends Omit<TaskFormData, "intent" | "subtasks"> {
  intent: "create";
  status: TodosStatus;
}

export interface UpdateTodoPayload extends Partial<Omit<TaskFormData, "intent" | "subtasks">> {
  intent: "update";
  todoId: string;
}

export interface DeleteTodoPayload {
  intent: "delete";
  todoId: string;
}

export interface ToggleCompleteTodoPayload {
  intent: "toggleComplete";
  todoId: string;
  completed: boolean;
}

export type TodoFormPayload =
  | CreateTodoPayload
  | UpdateTodoPayload
  | DeleteTodoPayload
  | ToggleCompleteTodoPayload;

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
  completed: boolean;
  order?: number;
  $updatedAt?: string;
}

export interface User {
  $id: string;
  email: string;
  name?: string;
}
