import { Postgres } from '@/core/database';
import type { Sql } from 'postgres';

export interface RepositoryContext {
  db: Postgres;
}

export abstract class Repository {
  protected sql: Sql;

  constructor(context: RepositoryContext) {
    this.sql = context.db.sql;
  }
}

export type RepositoryConstructor<T extends Repository = Repository> = new (
  context: RepositoryContext
) => T;