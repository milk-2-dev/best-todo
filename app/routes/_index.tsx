import { redirect } from "@remix-run/node";
import type { LoaderFunctionArgs } from "@remix-run/node";
import { account } from "~/lib/appwrite.server";

export async function loader({ request }: LoaderFunctionArgs) {
  try {
    // await account.get();
    return redirect("/backlog");
  } catch (error) {
    return redirect("/login");
  }
}
