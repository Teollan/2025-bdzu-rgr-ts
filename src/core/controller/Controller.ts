import { App } from '@/core/app/App';
import { Postgres } from '@/core/database';
import { Repository } from '@/core/repository';

export abstract class Controller {
  protected app: App;

  constructor(app: App) {
    this.app = app;
  }

  abstract run(): Promise<void>;

  protected makeRepository(RepositoryInstance: new (db: Postgres) => Repository) {
    return new RepositoryInstance(this.app.db);
  }
}
