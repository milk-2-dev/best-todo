import { type LoaderFunctionArgs } from "react-router";

import type { Route } from "./+types/_protected.today";

import type { Todo } from "~/types/todo";

import {
  getTodosByStatus,
  createTodo,
  updateTodo,
  deleteTodo,
} from "~/lib/todos.server";

import { requireUser } from "~/utils/session.server";

import TodoPage from "../components/todos/TodoPage";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Best todo | today" },
    { name: "description", content: "All yours todos for today" },
  ];
}

export async function loader({ request }: LoaderFunctionArgs) {
  try {
    const user = await requireUser(request);
    const todos = await getTodosByStatus(user.$id, "today");

    return Response.json({ todos, user });
  } catch (error) {
    throw new Response("Unauthorized", { status: 401 });
  }
}

export async function action({ request }: Route.ActionArgs): Promise<Response> {
  const user = await requireUser(request);
  const data = await request.json();
  const { intent, todoId, ...todoData } = data;

  try {
    switch (intent) {
      case "create": {
        const newTodo = await createTodo(user.$id, data);

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

        const updatedTodo = await updateTodo(todoId, data);

        return Response.json({
          success: true,
          todo: updatedTodo,
          message: "Todo updated successfully",
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

        await deleteTodo(todoId);
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
