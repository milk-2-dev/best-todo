import { Query, ID } from "node-appwrite";
import { format } from "date-fns";

import { DATABASE_ID, TODOS_COLLECTION_ID } from "./appwrite.server";

import type {
  CreateTodoInput,
  UpdateTodoInput,
  TodosStatus,
  TodoNode,
} from "~/types/todo";
import type { Todos } from "~/types/appwrite";
import { determineStatus } from "./utils";

const todosTableCredentials = {
  databaseId: DATABASE_ID,
  tableId: TODOS_COLLECTION_ID,
};

type Response = {
  total: number;
  rows: Todos[];
};

type DelteTodoResponse = {
  success: boolean;
};

export async function fetchSubtasks(
  tablesDB: any,
  userId: string,
  parentId: string,
  depth: number
): Promise<TodoNode[]> {
  if (depth > 4) return [];

  const response = await tablesDB.listRows({
    ...todosTableCredentials,
    queries: [
      Query.equal("userId", userId),
      Query.equal("parentId", parentId),
      Query.orderAsc("order"),
    ],
  });

  const subtasks = response.rows ?? [];

  return Promise.all(
    subtasks.map(async (todo: TodoNode) => ({
      ...todo,
      subtasks: await fetchSubtasks(tablesDB, userId, todo.$id, depth + 1),
    }))
  );
}

export async function getTodosTree(
  tablesDB: any,
  userId: string,
  status: TodosStatus
): Promise<TodoNode[]> {
  const rootResponse = await tablesDB.listRows({
    ...todosTableCredentials,
    queries: [
      Query.equal("userId", userId),
      Query.isNull("parentId"),
      ...getStatusQueries(status),
      Query.orderAsc("order"),
    ],
  });

  const rootTodos = rootResponse.rows ?? [];

  return Promise.all(
    rootTodos.map(async (todo: TodoNode) => ({
      ...todo,
      subtasks: await fetchSubtasks(tablesDB, userId, todo.$id, 1),
    }))
  );
}

function getStatusQueries(status: TodosStatus) {
  switch (status) {
    case "backlog":
      return [
        Query.equal("completed", false),
        Query.or([
          Query.lessThan("dueDate", format(new Date(), "PPP")),
          Query.isNull("dueDate"),
        ]),
        Query.orderAsc("order")
      ];
    case "today":
      return [
        Query.equal("completed", false),
        Query.equal("dueDate", format(new Date(), "PPP")),
        Query.orderAsc("order")
      ];
    case "upcoming":
      return [
        Query.equal("completed", false),
        Query.greaterThan("dueDate", format(new Date(), "PPP")),
        Query.orderAsc("dueDate")
      ];
    case "completed":
      return [Query.equal("completed", true)];
    default:
      return [];
  }
}

export async function getUserTodos(
  tablesDB,
  userId: string
): Promise<Response> {
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
  status: TodosStatus
): Promise<Response> {
  try {
    const response = await tablesDB.listRows({
      ...todosTableCredentials,
      queries: [
        Query.equal("userId", userId),
        Query.equal("completed", false),
        ...getStatusQueries(status),
      ],
    });

    return response.rows as unknown as Response;
  } catch (error) {
    console.error(`Error fetching ${status} todos:`, error);
    throw error;
  }
}

export async function createTodo(
  tablesDB,
  userId: string,
  input: CreateTodoInput
): Promise<Todos> {
  const todos = await getUserTodos(tablesDB, userId);
  const maxOrder = todos.rows.reduce(
    (max, todo) => Math.max(max, todo.order),
    0
  );

  const todoData = {
    title: input.title,
    description: input.description,
    dueDate: input.dueDate,
    priority: input.priority,
    completed: false,
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

    return {
      $id: "new-id",
      ...todoData,
      createdAt: new Date().toISOString(),
    } as unknown as Todos;
  } catch (error) {
    throw error;
  }
}

export async function updateTodo(
  tablesDB,
  todoId: string,
  updates: UpdateTodoInput
): Promise<Todos> {
  try {
    const response = await tablesDB.updateRow({
      ...todosTableCredentials,
      rowId: todoId,
      data: {
        ...updates,
      },
    });

    return response as unknown as Todos;
  } catch (error) {
    console.log("Appwrite", "Error: " + error);
    throw error;
  }
}

export async function toggleTodoComplete(
  tablesDB,
  todoId: string,
  isCompleted: boolean
): Promise<Todos> {
  const updates: UpdateTodoInput = {
    completed: isCompleted,
    $updatedAt: new Date().toISOString(),
  };

  return updateTodo(tablesDB, todoId, updates);
}

export async function getSubtasks(
  tablesDB,
  parentId: string
): Promise<Todos[]> {
  try {
    const response = await tablesDB.listRows({
      ...todosTableCredentials,
      queries: [Query.equal("parentId", parentId), Query.orderAsc("order")],
    });

    return response.documents as unknown as Todos[];
  } catch (error) {
    console.error("Error fetching subtasks:", error);
    return [];
  }
}

export async function deleteTodo(
  tablesDB,
  todoId: string
): Promise<DelteTodoResponse> {
  const subtasks = await getSubtasks(tablesDB, todoId);

  if (subtasks) {
    console.log(`Deleting ${subtasks.length} subtasks of todo ${todoId}`);
    for (const subtask of subtasks) {
      await deleteTodo(tablesDB, subtask.$id);
    }
  }

  try {
    const response = await tablesDB.deleteRow({
      ...todosTableCredentials,
      rowId: todoId,
    });

    return response as unknown as DelteTodoResponse;
  } catch (error) {
    console.log("Appwrite", "Error: " + error);
    throw error;
  }
}
