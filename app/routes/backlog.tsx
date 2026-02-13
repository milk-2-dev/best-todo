import { data, useLoaderData, type LoaderFunctionArgs } from "react-router";

import type { Route } from "./+types/backlog";
import TodoPage from "../components/todos/TodoPage";
import type { Todo } from "~/types/todo";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "New React Router App" },
    { name: "description", content: "Welcome to React Router!" },
  ];
}

import {
  getTodosByStatus,
  createTodo,
  updateTodo,
  deleteTodo,
} from "~/lib/todos.server";
// import { account } from "~/lib/appwrite.server";

export async function loader({ request }: LoaderFunctionArgs) {
  try {
    const user = { $id: "698ce6aa002f3eeb8a61" }; //await account.get();
    const todos = await getTodosByStatus(user.$id, "backlog");

    return Response.json({ todos, user });
  } catch (error) {
    throw new Response("Unauthorized", { status: 401 });
  }
}

type ActionData = {
  success: boolean;
  todo?: Todo;
  error?: string;
};

export async function action({ request }: Route.ActionArgs): Promise<Response> {
  const data = await request.json();
  const { intent, todoId, ...todoData } = data;

  console.log("Action received:", { intent, todoId, todoData });

  try {
    switch (intent) {
      case "create": {
        const newTodo = await createTodo("698ce6aa002f3eeb8a61", data);

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

    // if (intent === "create") {
    //   const response = await createTodo("698ce6aa002f3eeb8a61", data);
    // }

    // if (intent === "update") {
    //   const response = await updateTodo(data.$id, data);
    // }

    // if (intent === "delete") {
    //   console.log("Delete Task Action");
    //   const response = await deleteTodo(data.todoId);

    //   // await databases.deleteDocument(DB_ID, TASKS_COLLECTION_ID, formData.get('id') as string);
    // }
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
  const { todos, user } = loaderData;

  return <TodoPage todos={todos} />;
}
