import { InputOutput } from '@/core/io/InputOutput';

export interface ViewContext {
  io: InputOutput;
}

export abstract class View {
  protected io: InputOutput;

  constructor(context: ViewContext) {
    this.io = context.io;
  }
}

export type ViewConstructor<T extends View = View> = new (
  context: ViewContext
) => T;
