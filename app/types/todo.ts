import type { Todos, TodosStatus } from "./appwrite";

export type Priority = "low" | "medium" | "high";
export type ViewMode = "list" | "board";

export interface TodoNode extends Todos {
  subtasks: TodoNode[];
}

export type TaskFormIntent = "create" | "update" | "delete";

export interface TaskFormData {
  intent: TaskFormIntent;
  title: string;
  description: string | null;
  status: TodosStatus;
  priority: Priority;
  dueDate: string;
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

export type TodoFormPayload =
  | CreateTodoPayload
  | UpdateTodoPayload
  | DeleteTodoPayload;

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
  status?: TodosStatus;
  order?: number;
}

export interface User {
  $id: string;
  email: string;
  name?: string;
}
