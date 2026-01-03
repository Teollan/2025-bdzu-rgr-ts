import { Environment } from '@/core/environment';
import postgres, { type Sql } from "postgres";

export class Postgres {
  private static instance: Sql | null = null;

  static async connect(): Promise<void> {
    Postgres.instance = postgres({
      host: Environment.dbHost,
      port: Environment.dbPort,
      database: Environment.dbName,
      username: Environment.dbUsername,
      password: Environment.dbPassword,
      transform: postgres.camel,
    });
  }

  static async disconnect(): Promise<void> {
    if (Postgres.instance) {
      await Postgres.instance.end();

      Postgres.instance = null;
    }
  }

  static get sql(): Sql {
    if (!Postgres.instance) {
      throw new Error("Database not connected. Call Postgres.connect() first.");
    }

    return Postgres.instance;
  }
}
