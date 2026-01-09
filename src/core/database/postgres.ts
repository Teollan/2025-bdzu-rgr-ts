import { Environment } from '@/core/environment';
import postgres, { type Sql } from "postgres";

export class Postgres {
  private instance: Sql | null = null;

  async connect(): Promise<void> {
    if (this.instance) {
      throw new Error("Database already connected. Call Postgres.disconnect() first.");
    }

    this.instance = postgres({
      host: Environment.dbHost,
      port: Environment.dbPort,
      database: Environment.dbName,
      username: Environment.dbUsername,
      password: Environment.dbPassword,
      transform: postgres.camel,
      debug: (
        Environment.isDebugMode
          ? (_, query, params) => {
            console.debug('[DEBUG] SQL');
            console.debug('QUERY:', query.replace(/\s+/g, ' ').trim());
            console.debug('Parameters:', params);
          }
          : undefined
      ),
    });
  }

  async disconnect(): Promise<void> {
    if (this.instance) {
      await this.instance.end();

      this.instance = null;
    }
  }

  get sql(): Sql {
    if (!this.instance) {
      throw new Error("Database not connected. Call Postgres.connect() first.");
    }

    return this.instance;
  }
}
