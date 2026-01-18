import { Postgres } from '@/core/database';
import { Model, ModelConstructor } from '@/core/model/Model';
import { Router } from '@/core/router/Router';
import { View, ViewConstructor } from '@/core/view/View';
import { Page } from '@/lib/pagination';
import prompts, { PromptObject, Options, Answers } from 'prompts';

type PageCallback<T, M> = M extends void
  ? (items: T[], page: number) => void
  : (items: T[], page: number, meta: M) => void;

export type BrowsePagesOptions<T, M = void> = {
  data: Page<T, M>;
  onPage: PageCallback<T, M>;
  onEmptyPage?: PageCallback<T, M>;
};

export interface ControllerContext {
  db: Postgres;
  router: Router;
}
export abstract class Controller {
  protected db: Postgres;
  protected router: Router;

  constructor(context: ControllerContext) {
    this.db = context.db;
    this.router = context.router;
  }

  public abstract run(): Promise<void>;

  protected makeModel<T extends Model>(
    ModelClass: ModelConstructor<T>
  ): T {
    return new ModelClass({
      db: this.db,
    });
  }

  protected makeView<T extends View>(
    ViewClass: ViewConstructor<T>
  ): T {
    return new ViewClass();
  }

  protected async browsePages<T, M = void>({
    data,
    onPage,
    onEmptyPage = onPage,
  }: BrowsePagesOptions<T, M>): Promise<void> {
    let result = data;

    const call = (fn: PageCallback<T, M>, items: T[], page: number, meta?: M) =>
      (fn as (items: T[], page: number, meta?: M) => void)(items, page, meta);

    if (result.items.length === 0) {
      call(onEmptyPage, result.items, 1, (result as { meta?: M }).meta);

      return;
    }

    if (!result.next && !result.prev) {
      call(onPage, result.items, 1, (result as { meta?: M }).meta);

      return;
    }

    while (true) {
      const { items, limit, offset, next, prev } = result;
      const meta = (result as { meta?: M }).meta;
      const page = Math.floor(offset / limit) + 1;

      call(onPage, items, page, meta);

      const input = await this.ask({
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

      if (!input || !input.action) {
        break;
      }

      const { action } = input;

      result = await action();
    }
  }

  protected async ask<T extends string>(
    questions: PromptObject<T> | PromptObject<T>[],
    options?: Options
  ): Promise<Answers<T> | null> {
    try {
      const response = await prompts(questions, {
        ...options,
        onCancel: (...args) => {
          options?.onCancel?.(...args);

          throw new Error('Prompt cancelled by user');
        },
      });

      return response;
    } catch {
      return null;
    }
  }
}

export type ControllerConstructor<T extends Controller = Controller> = new (
  context: ControllerContext
) => T;