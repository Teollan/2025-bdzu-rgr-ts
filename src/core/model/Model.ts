import { Postgres } from '@/core/database';
import type { Sql } from 'postgres';

export interface ModelContext {
  db: Postgres;
}

export abstract class Model {
  protected sql: Sql;

  constructor(context: ModelContext) {
    this.sql = context.db.sql;
  }
}

export type ModelConstructor<T extends Model = Model> = new (
  context: ModelContext
) => T;
