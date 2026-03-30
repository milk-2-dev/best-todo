import { Client, Account, Databases, ID, TablesDB } from "node-appwrite";
import "dotenv/config";

// ========================================
// SERVER CLIENT (with API key)
// ========================================

const pablicClient = new Client()
  .setEndpoint(process.env.APPWRITE_ENDPOINT || "https://cloud.appwrite.io/v1")
  .setProject(process.env.APPWRITE_PROJECT_ID || "");

// ========================================
// SERVER CLIENT (with API key)
// ========================================

const serverClient = new Client()
  .setEndpoint(process.env.APPWRITE_ENDPOINT || "https://cloud.appwrite.io/v1")
  .setProject(process.env.APPWRITE_PROJECT_ID || "");

if (process.env.APPWRITE_API_KEY) {
  serverClient.setKey(process.env.APPWRITE_API_KEY);
} else {
  console.warn("⚠️  No APPWRITE_API_KEY - session creation will fail!");
}

// ========================================
// PUBLIC ACCOUNT (login/signup)
// ========================================

export const publicAccount = new Account(pablicClient);

// ========================================
// ADMIN SERVICES (cleanup, management)
// ========================================

export const serverAccount = new Account(serverClient);
export const serverDatabases = new Databases(serverClient);
export const serverTablesDB = new TablesDB(serverClient);

// ========================================
// SESSION CLIENT (authenticated requests)
// ========================================

export function createSessionClient(sessionToken: string) {
  const sessionClient = new Client()
    .setEndpoint(
      process.env.APPWRITE_ENDPOINT || "https://cloud.appwrite.io/v1"
    )
    .setProject(process.env.APPWRITE_PROJECT_ID || "")
    .setSession(sessionToken);

  return {
    account: new Account(sessionClient),
    databases: new Databases(sessionClient),
    tablesDB: new TablesDB(sessionClient),
  };
}

// ========================================
// EXPORTS
// ========================================

export { ID };
export const DATABASE_ID = process.env.APPWRITE_DATABASE_ID || "";
export const TODOS_COLLECTION_ID =
  process.env.APPWRITE_TODOS_COLLECTION_ID || "";
