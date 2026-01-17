import { Postgres } from '@/core/database';
import { InputOutput } from '@/core/io/InputOutput';
import { Repository, RepositoryConstructor } from '@/core/repository/Repository';
import { Router } from '@/core/router/Router';
import { View, ViewConstructor } from '@/core/view/View';
import { Paginated } from '@/lib/pagination';
import prompts from 'prompts';

export interface BrowsePagesOptions<T> {
  data: Paginated<T>;
  onPage: (items: T[], page: number) => void;
  onEmptyPage?: (items: T[], page: number) => void;
}

export interface ControllerContext {
  db: Postgres;
  io: InputOutput;
  router: Router;
}
export abstract class Controller {
  protected db: Postgres;
  protected io: InputOutput;
  protected router: Router;

  protected ask = prompts;

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

  protected async browsePages<T>({
    data,
    onPage,
    onEmptyPage = onPage,
  }: BrowsePagesOptions<T>): Promise<void> {
    let result = data;

    if (result.items.length === 0) {
      onEmptyPage(result.items, 1);

      return;
    }

    if (!result.next && !result.prev) {
      onPage(result.items, 1);

      return;
    }

    while (true) {
      const {
        items,
        limit,
        offset,
        next,
        prev,
      } = result;

      const page = Math.floor(offset / limit) + 1;

      onPage(items, page);

      const { action } = await this.ask({
        name: 'action',
        type: 'select',
        message: 'What would you like to do next?',
        choices: [
          {
            title: 'Next Page',
            value: next,
            disabled: !next,
          },
          {
            title: 'Previous Page',
            value: prev,
            disabled: !prev,
          },
          {
            title: 'Done',
            value: null,
          },
        ],
      });

      if (!action) {
        break;
      }

      result = await action();
    }
  }
}

export type ControllerConstructor<T extends Controller = Controller> = new (
  context: ControllerContext
) => T;