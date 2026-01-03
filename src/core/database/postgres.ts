import { Database, DatabaseConnectionParams } from "@/core/database/database";
import postgres, { type Sql } from "postgres";

export class Postgres implements Database {
  private static instance: Sql | null = null;

  public async connect(params: DatabaseConnectionParams): Promise<void> {
    Postgres.instance = postgres({
      host: params.host,
      port: params.port,
      database: params.database,
      username: params.username,
      password: params.password,
    });
  }

  public async disconnect(): Promise<void> {
    if (Postgres.instance) {
      await Postgres.instance.end();

      Postgres.instance = null;
    }
  }

  public async query<T extends object>(
    strings: TemplateStringsArray,
    ...values: unknown[]
  ): Promise<T[]> {
    if (!Postgres.instance) {
      throw new Error("Database not connected. Call connect() first.");
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const result = await (Postgres.instance as any)(strings, ...values);

    return result as T[];
  }
}
