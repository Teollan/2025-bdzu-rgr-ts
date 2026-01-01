import { Database } from "@/core/database/database";
import { PostgresDatabase } from "@/core/database/postgres";
import { Environment } from '@/core/environment';

export const makeAndConnectDatabase = async (): Promise<Database> => {
  const db = makeDatabase();

  await db.connect({
    host: Environment.dbHost,
    port: Environment.dbPort,
    database: Environment.dbName,
    username: Environment.dbUsername,
    password: Environment.dbPassword,
  });

  return db;
};

export const makeDatabase = (): Database => {
  return new PostgresDatabase();
}
