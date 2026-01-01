import { Database, makeDatabase } from '@/core/database';

export abstract class Repository {
  protected db: Database = makeDatabase();

  protected safeSet(
    field: string,
    value: Date | string | number | boolean | null | undefined,
  ): string {
    return `${field} = COALESCE(${value ?? null}, ${field})`;
  }
}
