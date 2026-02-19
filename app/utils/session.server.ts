import { createCookieSessionStorage, redirect } from "react-router";
import { createSessionClient } from "~/lib/appwrite.server";

const sessionSecret = process.env.SESSION_SECRET || "s3cr3t";

console.log("Node environment from sessionStorage: ", process.env.NODE_ENV);
console.log("Is CI: ", process.env.CI);
console.log(
  "Is session secure: ",
  process.env.NODE_ENV === "production" && !process.env.CI
);

console.log('🔐 SESSION_SECRET:', process.env.SESSION_SECRET ? 
  process.env.SESSION_SECRET : 
  'USING FALLBACK: s3cr3t'
)

const sessionStorage = createCookieSessionStorage({
  cookie: {
    name: "__session",
    httpOnly: true,
    path: "/",
    domain: undefined,
    sameSite: "lax",
    secrets: [sessionSecret],
    secure: process.env.NODE_ENV === "production" && !process.env.CI,
    maxAge: 60 * 60 * 24 * 30, // 30 days
  },
});

export async function getSession(request: Request) {
  const cookie = request.headers.get("Cookie");
  console.log('📝 Cookie:', cookie)  // ← приходит ли?
  return sessionStorage.getSession(cookie);
}

export async function getSessionToken(
  request: Request
): Promise<string | null> {
  const session = await getSession(request);
  console.log('📦 Session data:', session.data)  // ← что прочитано?
  return session.get("sessionToken") || null;
}

export async function getUserFromSession(request: Request) {
  console.log('🔍 GET USER')

  const sessionToken = await getSessionToken(request);

  console.log('🔑 Token:', sessionToken ? 'EXISTS' : 'MISSING')

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

  console.log('\n🔐 ===== CREATE USER SESSION =====')
  console.log('📧 Redirect to:', redirectTo)
  console.log('🎫 Session token:', sessionToken)

  const session = await getSession(request);

  console.log("📦 Session data:", session.data); // ← что сохранено?

  const cookie = await sessionStorage.commitSession(session, {
    maxAge: 60 * 60 * 24 * 7, // 7 days
  });
  console.log("🍪 Cookie length:", cookie.length); // ← создался ли?
  console.log('================================\n')

  return redirect(redirectTo, {
    headers: {
      "Set-Cookie": cookie,
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
