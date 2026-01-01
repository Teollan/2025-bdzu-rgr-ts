export abstract class Controller<T> {
  abstract run(args: T): Promise<void>;
}
