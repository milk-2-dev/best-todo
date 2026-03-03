import { type LoaderFunctionArgs } from "react-router";

import type { Route } from "./+types/_protected.backlog";

import {
  getTodosByStatus,
  createTodo,
  updateTodo,
  deleteTodo,
  toggleTodoComplete,
} from "~/lib/todos.server";

import {
  getSessionToken,
  getUserFromSession,
  requireUser,
} from "~/utils/session.server";
import { createSessionClient } from "~/lib/appwrite.server";

import TodoPage from "../components/todos/TodoPage";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Best todo | backlog" },
    { name: "description", content: "All yours todos" },
  ];
}

export async function loader({ request }: LoaderFunctionArgs) {
  try {
    const sessionToken = await getSessionToken(request);
    const user = await getUserFromSession(request);

    const { tablesDB } = createSessionClient(sessionToken);
    const todos = await getTodosByStatus(tablesDB, user.$id, "backlog");

    return Response.json({ todos, user });
  } catch (error) {
    throw new Response("Unauthorized", { status: 401 });
  }
}

export async function action({ request }: Route.ActionArgs): Promise<Response> {
  const user = await requireUser(request);

  try {
    const sessionToken = await getSessionToken(request);

    if (sessionToken && user) {
      const { tablesDB } = createSessionClient(sessionToken);

      const data = await request.json();
      const { intent, todoId } = data;

      switch (intent) {
        case "create": {
          const newData = { ...data };
          delete newData.intent;

          const newTodo = await createTodo(tablesDB, user.$id, newData);

          return Response.json({
            success: true,
            todo: newTodo,
            message: "Todo created successfully",
          });
        }

        case "update": {
          if (!todoId) {
            return Response.json(
              {
                success: false,
                error: "Todo ID is required",
              },
              { status: 400 }
            );
          }

          const newData = { ...data };
          delete newData.intent;
          delete newData.subtasks;
          delete newData.todoId;

          const updatedTodo = await updateTodo(tablesDB, todoId, newData);

          return Response.json({
            success: true,
            todo: updatedTodo,
            message: "Todo updated successfully",
          });
        }

        case "toggleComplete": {
          if (!todoId) {
            return Response.json(
              {
                success: false,
                error: "Todo ID is required",
              },
              { status: 400 }
            );
          }

          await toggleTodoComplete(tablesDB, todoId, data.completed);
          return Response.json({
            success: true,
            message: "Todo complete status changed successfully",
          });
        }

        case "delete": {
          if (!todoId) {
            return Response.json(
              {
                success: false,
                error: "Todo ID is required",
              },
              { status: 400 }
            );
          }

          await deleteTodo(tablesDB, todoId);
          return Response.json({
            success: true,
            message: "Todo deleted successfully",
          });
        }

        default:
          return Response.json(
            {
              success: false,
              error: "Invalid intent",
            },
            { status: 400 }
          );
      }
    }
  } catch (error) {
    console.error("Todo action error:", error);
    return Response.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "An error occurred",
      },
      { status: 500 }
    );
  }
}

export default function Backlog({ loaderData }: Route.ComponentProps) {
  const { todos } = loaderData;

  return <TodoPage todos={todos} />;
}
