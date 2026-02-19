import { createCookieSessionStorage, redirect } from "react-router";
import { createSessionClient } from "~/lib/appwrite.server";

const sessionSecret = process.env.SESSION_SECRET || "default-secret-key";

const sessionStorage = createCookieSessionStorage({
  cookie: {
    name: "__session",
    httpOnly: true,
    path: "/",
    sameSite: "lax",
    secrets: [sessionSecret],
    secure: process.env.NODE_ENV === "production",
    maxAge: 60 * 60 * 24 * 30, // 30 дней
  },
});

export async function getSession(request: Request) {
  const cookie = request.headers.get("Cookie");
  return sessionStorage.getSession(cookie);
}

export async function getSessionToken(
  request: Request
): Promise<string | null> {
  const session = await getSession(request);
  return session.get("sessionToken") || null;
}

export async function getUserFromSession(request: Request) {
  const sessionToken = await getSessionToken(request);

  if (!sessionToken) {
    console.log("❌ No sessionToken in session");
    return null;
  }

  try {
    const { account } = createSessionClient(sessionToken);
    const user = await account.get();
    return user;
  } catch (error) {
    console.log("❌ Failed to get user:", error);
    return null;
  }
}

export async function requireUser(request: Request) {
  const user = await getUserFromSession(request);
  if (!user) {
    const url = new URL(request.url);
    const redirectTo = url.pathname + url.search;
    throw redirect(`/login?redirectTo=${encodeURIComponent(redirectTo)}`);
  }
  return user;
}

export async function createUserSession({
  request,
  sessionToken,
  redirectTo,
}: {
  request: Request;
  sessionToken: string;
  redirectTo: string;
}) {
  const session = await getSession(request);
  session.set("sessionToken", sessionToken);

  return redirect(redirectTo, {
    headers: {
      "Set-Cookie": await sessionStorage.commitSession(session, {
        maxAge: 60 * 60 * 24 * 7, // 7 days
      }),
    },
  });
}

export async function logout(request: Request) {
  const session = await getSession(request);
  const sessionToken = session.get("sessionToken");

  if (sessionToken) {
    try {
      const { account } = createSessionClient(sessionToken);
      await account.deleteSession("current");
    } catch (error) {
      console.error("Error deleting Appwrite session:", error);
    }
  }

  return redirect("/login", {
    headers: {
      "Set-Cookie": await sessionStorage.destroySession(session),
    },
  });
}
