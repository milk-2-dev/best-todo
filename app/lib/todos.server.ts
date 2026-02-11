import {
  databases,
  DATABASE_ID,
  TODOS_COLLECTION_ID,
  tablesDB,
} from "./appwrite.server";
import { Query, ID } from "appwrite";
import type {
  Todo,
  CreateTodoInput,
  UpdateTodoInput,
  Status,
} from "~/types/todo";
import { determineStatus } from "./utils";

// @klimov: try this construction
const todosTableCredentials = {
  databaseId: DATABASE_ID,
  tableId: TODOS_COLLECTION_ID,
};

type Response = {
  total: number;
  rows: Todo[];
};

export async function getUserTodos(userId: string): Promise<Response> {
  try {
    const response = await tablesDB.listRows({
      ...todosTableCredentials,
      queries: [Query.equal("userId", userId), Query.orderAsc("order")],
    });

    return response as unknown as Response;
  } catch (error) {
    console.error("Error fetching todos:", error);
    throw error;
  }
}

export async function getTodosByStatus(
  userId: string,
  status: Status
): Promise<Todo[]> {
  try {
    const response = await databases.listDocuments(
      DATABASE_ID,
      TODOS_COLLECTION_ID,
      [
        Query.equal("userId", userId),
        Query.equal("status", status),
        Query.orderAsc("order"),
      ]
    );

    return response.documents as unknown as Todo[];
  } catch (error) {
    console.error(`Error fetching ${status} todos:`, error);
    return [];
  }
}

export async function getSubtasks(parentId: string): Promise<Todo[]> {
  try {
    const response = await databases.listDocuments(
      DATABASE_ID,
      TODOS_COLLECTION_ID,
      [Query.equal("parentId", parentId), Query.orderAsc("order")]
    );

    return response.documents as unknown as Todo[];
  } catch (error) {
    console.error("Error fetching subtasks:", error);
    return [];
  }
}

export async function createTodo(
  userId: string,
  input: CreateTodoInput
): Promise<Todo> {
  const status = input.dueDate ? determineStatus(input.dueDate) : "backlog";

  const todos = await getUserTodos(userId);
  const maxOrder = todos.reduce((max, todo) => Math.max(max, todo.order), 0);

  const todoData = {
    title: input.title,
    description: input.description || "",
    dueDate: input.dueDate || null,
    priority: input.priority,
    status,
    parentId: input.parentId || null,
    userId,
    createdAt: new Date().toISOString(),
    completedAt: null,
    order: maxOrder + 1,
  };

  const response = await databases.createDocument(
    DATABASE_ID,
    TODOS_COLLECTION_ID,
    ID.unique(),
    todoData
  );

  return response as unknown as Todo;
}

export async function updateTodo(
  todoId: string,
  updates: UpdateTodoInput
): Promise<Todo> {
  const updateData: Record<string, any> = {};

  if (updates.title !== undefined) updateData.title = updates.title;
  if (updates.description !== undefined)
    updateData.description = updates.description;
  if (updates.dueDate !== undefined) updateData.dueDate = updates.dueDate;
  if (updates.priority !== undefined) updateData.priority = updates.priority;
  if (updates.status !== undefined) updateData.status = updates.status;
  if (updates.order !== undefined) updateData.order = updates.order;
  if (updates.completedAt !== undefined)
    updateData.completedAt = updates.completedAt;

  const response = await databases.updateDocument(
    DATABASE_ID,
    TODOS_COLLECTION_ID,
    todoId,
    updateData
  );

  return response as unknown as Todo;
}

export async function deleteTodo(todoId: string): Promise<void> {
  const subtasks = await getSubtasks(todoId);
  for (const subtask of subtasks) {
    await deleteTodo(subtask.$id);
  }

  await databases.deleteDocument(DATABASE_ID, TODOS_COLLECTION_ID, todoId);
}

/**
 * Отмечает задачу как выполненную
 */
export async function toggleTodoComplete(
  todoId: string,
  isCompleted: boolean
): Promise<Todo> {
  const updates: UpdateTodoInput = {
    status: isCompleted ? "completed" : "backlog",
    completedAt: isCompleted ? new Date().toISOString() : null,
  };

  return updateTodo(todoId, updates);
}

/**
 * Обновляет статус задачи (для drag & drop)
 */
export async function updateTodoStatus(
  todoId: string,
  newStatus: Status
): Promise<Todo> {
  return updateTodo(todoId, { status: newStatus });
}
