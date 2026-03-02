import { Query, ID } from "node-appwrite";
import { format } from "date-fns";

import { DATABASE_ID, TODOS_COLLECTION_ID } from "./appwrite.server";

import type {
  CreateTodoInput,
  UpdateTodoInput,
  TodosStatus,
} from "~/types/todo";
import type { Todos } from "~/types/appwrite";
import { determineStatus } from "./utils";

// @klimov: try this construction
const todosTableCredentials = {
  databaseId: DATABASE_ID,
  tableId: TODOS_COLLECTION_ID,
};

type Response = {
  total: number;
  rows: Todos[];
};

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
    let statusQueries = [];

    switch (status) {
      case "backlog":
        statusQueries = [
          Query.equal("completed", false),
          Query.or([
            Query.lessThan("dueDate", format(new Date(), "PPP")),
            Query.isNull("dueDate"),
          ]),
        ];

        break;
      case "today":
        statusQueries = [
          Query.equal("completed", false),
          Query.equal("dueDate", format(new Date(), "PPP")),
        ];
        break;
      case "upcoming":
        statusQueries = [
          Query.equal("completed", false),
          Query.greaterThan("dueDate", format(new Date(), "PPP")),
        ];
        break;
      case "completed":
        statusQueries = [Query.equal("completed", true)];
        break;

      default:
        statusQueries = [];
        break;
    }

    const response = await tablesDB.listRows({
      ...todosTableCredentials,
      queries: [
        Query.equal("userId", userId),
        Query.equal("completed", false),
        ...statusQueries,
        Query.orderAsc("order"),
      ],
    });

    return response as unknown as Response;
  } catch (error) {
    console.error(`Error fetching ${status} todos:`, error);
    throw error;
  }
}

export async function getSubtasks(
  tablesDB,
  parentId: string
): Promise<Todos[]> {
  try {
    const response = await tablesDB.listDocuments(
      DATABASE_ID,
      TODOS_COLLECTION_ID,
      [Query.equal("parentId", parentId), Query.orderAsc("order")]
    );

    return response.documents as unknown as Todos[];
  } catch (error) {
    console.error("Error fetching subtasks:", error);
    return [];
  }
}

export async function createTodo(
  tablesDB,
  userId: string,
  input: CreateTodoInput
): Promise<Todos> {
  const status = input.dueDate ? determineStatus(input.dueDate) : "backlog";

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

    console.log("Created todo:", response);

    return {
      $id: "new-id",
      ...todoData,
      createdAt: new Date().toISOString(),
    } as unknown as Todos;
  } catch (error) {
    console.log("Appwrite", "Error: " + error);
  }
}

export async function updateTodo(
  tablesDB,
  todoId: string,
  updates: UpdateTodoInput
): Promise<Todos> {
  // const { description, dueDate, order, priority, status, title } = updates;

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

export async function deleteTodo(tablesDB, todoId: string): Promise<void> {
  const subtasks = await getSubtasks(tablesDB, todoId);
  for (const subtask of subtasks) {
    await deleteTodo(tablesDB, subtask.$id);
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
