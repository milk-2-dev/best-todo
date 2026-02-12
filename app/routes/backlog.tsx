import { data, useLoaderData, type LoaderFunctionArgs } from "react-router";

import type { Route } from "./+types/backlog";
import { BacklogTodos } from "../todos/backlog";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "New React Router App" },
    { name: "description", content: "Welcome to React Router!" },
  ];
}

import { getTodosByStatus } from "~/lib/todos.server";
// import { account } from "~/lib/appwrite.server";

export async function loader({ request }: LoaderFunctionArgs) {
  try {
    const user = { $id: "698ce6aa002f3eeb8a61" }; //await account.get();
    const todos = await getTodosByStatus(user.$id, "backlog");

    console.log("Todos in loader:", todos);

    return data({ todos, user });
  } catch (error) {
    throw new Response("Unauthorized", { status: 401 });
  }
}

export default function Backlog({ loaderData }: Route.ComponentProps) {
  const { todos, user } = loaderData;

  return <BacklogTodos todos={todos} user={user} />;
}
