import { Outlet, redirect } from "react-router";
import type { Route } from "./+types/_auth";
import { getUserFromSession } from "~/utils/session.server";

export async function loader({ request }: Route.LoaderArgs) {
  const user = await getUserFromSession(request);

  if (user) {
    return redirect("/backlog");
  }
  
  return null;
}

export default function AuthLayout() {
  return <Outlet />;
}