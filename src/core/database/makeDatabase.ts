import { Database } from "@/core/database/database";
import { PostgresDatabase } from "@/core/database/postgres";

export const makeDatabase = (): Database => {
  return new PostgresDatabase();
};
