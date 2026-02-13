import { Client, Account, Databases } from "appwrite";

// Client-side Appwrite client (runs in browser)
export const createAppwriteClient = () => {
  const client = new Client()
    .setEndpoint(window.ENV.APPWRITE_ENDPOINT)
    .setProject(window.ENV.APPWRITE_PROJECT_ID);

  return {
    client,
    account: new Account(client),
    databases: new Databases(client),
  };
};

// Global type for window.ENV
declare global {
  interface Window {
    ENV: {
      APPWRITE_ENDPOINT: string;
      APPWRITE_PROJECT_ID: string;
      APPWRITE_DATABASE_ID: string;
      APPWRITE_TODOS_COLLECTION_ID: string;
    };
  }
}
