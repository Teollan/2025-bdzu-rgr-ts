import { Environment } from '@/core/environment';
import postgres, { type Sql } from "postgres";

export class Postgres {
  static instance: Sql | null = null;

  async connect(): Promise<void> {
    Postgres.instance = postgres({
      host: Environment.dbHost,
      port: Environment.dbPort,
      database: Environment.dbName,
      username: Environment.dbUsername,
      password: Environment.dbPassword,
      transform: postgres.camel,
    });
  }

  async disconnect(): Promise<void> {
    if (Postgres.instance) {
      await Postgres.instance.end();

      Postgres.instance = null;
    }
  }

  get sql(): Sql {
    if (!Postgres.instance) {
      throw new Error("Database not connected. Call Postgres.connect() first.");
    }

    return Postgres.instance;
  }
}
