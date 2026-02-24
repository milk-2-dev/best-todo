import { createCookieSessionStorage, redirect } from "react-router";
import { createSessionClient } from "~/lib/appwrite.server";

const SESSION_SECRET = process.env.SESSION_SECRET || "s3cr3t";

const sessionStorage = createCookieSessionStorage({
  cookie: {
    name: "__session",
    httpOnly: true,
    path: "/",
    sameSite: "lax",
    secrets: [SESSION_SECRET],
    secure: process.env.NODE_ENV === "production" && !process.env.CI,
    maxAge: 60 * 60 * 24 * 7, // 7 days
  },
});

// ========================================
// READ SESSION
// ========================================

export async function getSession(request: Request) {
  const cookieHeader = request.headers.get("Cookie");

  try {
    const session = await sessionStorage.getSession(cookieHeader);

    return session;
  } catch (error) {
    console.log("❌ Failed to parse session:", error);
    return await sessionStorage.getSession(); // return empty session
  }
}

export async function getSessionToken(
  request: Request
): Promise<string | null> {
  try {
    const session = await getSession(request);

    const sessionToken = session.get("sessionToken");

    if (!sessionToken) {
      console.log("❌ No sessionToken in session");
    }

    return sessionToken || null;
  } catch (error) {
    console.log("❌ Error getting sessionToken:", error);
    return null;
  }
}

export async function getUserFromSession(request: Request) {
  const sessionToken = await getSessionToken(request);

  if (!sessionToken) return null;

  try {
    const { account } = createSessionClient(sessionToken);
    const user = await account.get();

    return user;
  } catch (error: any) {
    console.log("\n====================================");
    console.log("❌ Failed to get user from Appwrite:", error.message);
    console.log("====================================\n");
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

// ========================================
// CREATE SESSION
// ========================================

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

  const cookie = await sessionStorage.commitSession(session, {
    maxAge: 60 * 60 * 24 * 7, // 7 days
  });

  return redirect(redirectTo, {
    headers: {
      "Set-Cookie": cookie,
    },
  });
}

// ========================================
// DESTROY SESSION
// ========================================

export async function logout(request: Request) {
  const session = await getSession(request);
  const sessionToken = session.get("sessionToken");

  if (sessionToken) {
    try {
      const { account } = createSessionClient(sessionToken);
      await account.deleteSession("current");
      console.log("✅ Appwrite session deleted");
    } catch (error: any) {
      console.log("⚠️  Error deleting Appwrite session:", error.message);
    }
  } else {
    console.log("⚠️  No sessionToken to delete");
  }

  const destroyCookie = await sessionStorage.destroySession(session);

  return redirect("/login", {
    headers: {
      "Set-Cookie": destroyCookie,
    },
  });
}
