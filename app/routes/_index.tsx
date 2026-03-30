import { redirect } from "react-router";

import type { Route } from "./+types/_index";

import { getUserFromSession } from "~/utils/session.server";

export async function loader({ request }: Route.LoaderArgs) {
  const user = await getUserFromSession(request);

  if (user) {
    return redirect("/backlog");
  }

  return redirect("/login");
}
