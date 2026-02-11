import {
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  useLoaderData,
} from "@remix-run/react";
import type { LinksFunction, LoaderFunctionArgs } from "@remix-run/node";
import { json } from "@remix-run/node";

import styles from "@/styles/app.css?url";

export const links: LinksFunction = () => [
  { rel: "stylesheet", href: styles },
];

export async function loader({ request }: LoaderFunctionArgs) {
  return json({
    ENV: {
      APPWRITE_ENDPOINT: process.env.APPWRITE_ENDPOINT || "",
      APPWRITE_PROJECT_ID: process.env.APPWRITE_PROJECT_ID || "",
      APPWRITE_DATABASE_ID: process.env.APPWRITE_DATABASE_ID || "",
      APPWRITE_TODOS_COLLECTION_ID: process.env.APPWRITE_TODOS_COLLECTION_ID || "",
    },
  });
}

export function Layout({ children }: { children: React.ReactNode }) {
  const data = useLoaderData<typeof loader>();
  
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <Meta />
        <Links />
      </head>
      <body>
        {children}
        <ScrollRestoration />
        <script
          dangerouslySetInnerHTML={{
            __html: `window.ENV = ${JSON.stringify(data.ENV)}`,
          }}
        />
        <Scripts />
      </body>
    </html>
  );
}

export default function App() {
  return <Outlet />;
}
