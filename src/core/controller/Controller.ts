import { Postgres } from '@/core/database';
import { InputOutput } from '@/core/io/InputOutput';
import { Repository, RepositoryConstructor } from '@/core/repository/Repository';
import { Router } from '@/core/router/Router';
import { View, ViewConstructor } from '@/core/view/View';

export interface ControllerContext {
  db: Postgres;
  io: InputOutput;
  router: Router;
}

export abstract class Controller {
  protected db: Postgres;
  protected io: InputOutput;
  protected router: Router;

  constructor(context: ControllerContext) {
    this.db = context.db;
    this.io = context.io;
    this.router = context.router;
  }

  public abstract run(): Promise<void>;

  protected makeRepository<T extends Repository>(
    RepositoryClass: RepositoryConstructor<T>
  ): T {
    return new RepositoryClass({
      db: this.db,
    });
  }

  protected makeView<T extends View>(
    ViewClass: ViewConstructor<T>
  ): T {
    return new ViewClass({
      io: this.io,
    });
  }
}

export type ControllerConstructor<T extends Controller = Controller> = new (
  context: ControllerContext
) => T;