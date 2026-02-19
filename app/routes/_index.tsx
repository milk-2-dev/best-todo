import { redirect } from "react-router";
import type { Route } from "./+types/_index";
import { getUserFromSession } from "~/utils/session.server";

export async function loader({ request }: Route.LoaderArgs) {
  console.log("\n📍 ===== BACKLOG LOADER =====");
  console.log("🌐 URL:", request.url);
  console.log("📝 Headers:");

  // Логируем ВСЕ headers
  request.headers.forEach((value, key) => {
    console.log(
      `   ${key}: ${value.substring(0, 50)}${value.length > 50 ? "..." : ""}`
    );
  });

  const cookieHeader = request.headers.get("Cookie");
  console.log("🍪 Cookie header:", cookieHeader || "NONE");

  const user = await getUserFromSession(request);

  if (user) {
    return redirect("/backlog");
    console.log("👤 User ID:", user);
    console.log("=============================\n");
  }

  console.log("👤 User ID:", "NONE");
  console.log("=============================\n");

  return redirect("/login");
}
