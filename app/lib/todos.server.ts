import {
  DATABASE_ID,
  TODOS_COLLECTION_ID,
} from "./appwrite.server";
import { Query, ID } from "node-appwrite";
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

export async function getUserTodos(tablesDB, userId: string): Promise<Response> {
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
  tablesDB: any,
  userId: string,
  status: Status
): Promise<Response> {
  try {
    const response = await tablesDB.listRows({
      ...todosTableCredentials,
      queries: [
        Query.equal("userId", userId),
        Query.equal("status", status),
        Query.orderAsc("order"),
      ],
    });

    return response as unknown as Response;
  } catch (error) {
    console.error(`Error fetching ${status} todos:`, error);
    throw error;
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
  const maxOrder = todos.rows.reduce(
    (max, todo) => Math.max(max, todo.order),
    0
  );

  const todoData = {
    title: input.title,
    description: input.description,
    dueDate: input.dueDate,
    priority: input.priority,
    status,
    parentId: input.parentId,
    userId,
    order: maxOrder + 1,
  };

  try {
    const response = await tablesDB.createRow({
      ...todosTableCredentials,
      rowId: ID.unique(),
      data: todoData,
    });

    console.log("Created todo:", response);


    return {
      $id: "new-id",
      ...todoData,
      createdAt: new Date().toISOString(),
    } as unknown as Todo;

  } catch (error) {
    console.log("Appwrite", "Error: " + error);
  }
}

export async function updateTodo(
  todoId: string,
  updates: UpdateTodoInput
): Promise<Todo> {
  const { description, dueDate, order, priority, status, title } = updates;

  try {
    const response = await tablesDB.updateRow({
      ...todosTableCredentials,
      rowId: todoId,
      data: {
        description,
        dueDate,
        order,
        priority,
        status,
        title,
      },
    });

    return response as unknown as Todo;
  } catch (error) {
    console.log("Appwrite", "Error: " + error);
    throw error;
  }
}

export async function deleteTodo(todoId: string): Promise<void> {
  const subtasks = await getSubtasks(todoId);
  for (const subtask of subtasks) {
    await deleteTodo(subtask.$id);
  }

  try {
    const response = await tablesDB.deleteRow({
      ...todosTableCredentials,
      rowId: todoId,
    });
  } catch (error) {
    console.log("Appwrite", "Error: " + error);
    throw error;
  }
}

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

export async function updateTodoStatus(
  todoId: string,
  newStatus: Status
): Promise<Todo> {
  return updateTodo(todoId, { status: newStatus });
}
