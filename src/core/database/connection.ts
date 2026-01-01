import { Database, DatabaseConnectionParams } from "@/core/database/database";
import { makeDatabase } from "@/core/database/makeDatabase";
import { Sql } from "postgres";
import { PostgresDatabase } from "@/core/database/postgres";

let databaseInstance: Database | null = null;

export function connectDatabase(params: DatabaseConnectionParams): void {
  if (databaseInstance) {
    return;
  }

  databaseInstance = makeDatabase();
  databaseInstance.connect(params);
}

export function getDatabase(): Sql {
  if (!databaseInstance) {
    throw new Error("Database not connected. Call connectDatabase() first.");
  }

  return (databaseInstance as PostgresDatabase).getSql();
}

export function disconnectDatabase(): Promise<void> {
  if (!databaseInstance) {
    return Promise.resolve();
  }

  const db = databaseInstance;
  databaseInstance = null;
  return db.disconnect();
}
