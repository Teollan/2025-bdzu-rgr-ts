import { Postgres } from '@/core/database';
import { defined } from '@/lib/functional';
import type { Sql } from 'postgres';

export abstract class Repository {
  protected sql: Sql;

  constructor(db: Postgres) {
    this.sql = db.sql;
  }

  protected updates(input: Record<string, unknown>) {
    const entries = Object.entries(input);

    const definedEntries = entries.filter(([_, value]) => defined(value));

    const updates = Object.fromEntries(definedEntries);

    return this.sql(updates);
  }
}
