import {
  Client,
  Account,
  Databases,
  Functions,
  TablesDB,
  ID,
} from "node-appwrite";
import * as dotenv from 'dotenv'

// Load environment variables
dotenv.config()

const MODE = process.env.NODE_ENV

console.log(`Lib Appwrite server running in ${MODE} mode`)

const client = new Client()
  .setEndpoint(process.env.APPWRITE_ENDPOINT || "https://cloud.appwrite.io/v1")
  .setProject(process.env.APPWRITE_PROJECT_ID || "");

// For server-side operations
if (process.env.APPWRITE_API_KEY) {
  client.setKey(process.env.APPWRITE_API_KEY);
}

console.log('Server side project ', process.env.APPWRITE_PROJECT_ID);

export const account = new Account(client);
export const databases = new Databases(client);
export const functions = new Functions(client);
export const tablesDB = new TablesDB(client);


export const DATABASE_ID = process.env.APPWRITE_DATABASE_ID || "";
export const TODOS_COLLECTION_ID =
  process.env.APPWRITE_TODOS_COLLECTION_ID || "";

export function createSessionClient(sessionToken: string) {
  const sessionClient = new Client()
    .setEndpoint(
      process.env.APPWRITE_ENDPOINT || "https://cloud.appwrite.io/v1"
    )
    .setProject(process.env.APPWRITE_PROJECT_ID || "");

  sessionClient.setSession(sessionToken);

  return {
    account: new Account(sessionClient),
    databases: new Databases(sessionClient),
  };
}

export { client, ID };
