// app/routes/logout.tsx
import type { Route } from "./+types/logout";
import { logout } from "~/utils/session.server";

export async function action({ request }: Route.ActionArgs) {
  return logout(request);
}

export async function loader({ request }: Route.LoaderArgs) {
  return logout(request);
}