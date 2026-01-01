import { Database, DatabaseConnectionParams } from "@/core/database/database";
import postgres, { type Sql } from "postgres";

export class PostgresDatabase implements Database {
  private sql: Sql | null = null;

  public async connect(params: DatabaseConnectionParams): Promise<void> {
    this.sql = postgres({
      host: params.host,
      port: params.port,
      database: params.database,
      username: params.username,
      password: params.password,
    });
  }

  public async disconnect(): Promise<void> {
    if (this.sql) {
      await this.sql.end();
      this.sql = null;
    }
  }

  public async query<T extends object>(
    strings: TemplateStringsArray,
    ...values: unknown[]
  ): Promise<T[]> {
    if (!this.sql) {
      throw new Error("Database not connected. Call connect() first.");
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const result = await (this.sql as any)(strings, ...values);

    return result as T[];
  }

  public getSql(): Sql {
    if (!this.sql) {
      throw new Error("Database not connected. Call connect() first.");
    }

    return this.sql;
  }
}
