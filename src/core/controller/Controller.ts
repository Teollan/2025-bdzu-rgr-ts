import { App } from '@/core/app/App';
import { Postgres } from '@/core/database';
import { Repository } from '@/core/repository';

export abstract class Controller {
  protected app: App;

  constructor(app: App) {
    this.app = app;
  }

  public abstract invoke(): Promise<void>;

  protected abstract run(): Promise<void>;

  protected makeRepository<T extends Repository>(
    RepositoryInstance: new (db: Postgres) => T
  ): T {
    return new RepositoryInstance(this.app.db);
  }
}
