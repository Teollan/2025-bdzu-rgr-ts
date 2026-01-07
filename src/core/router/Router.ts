import { Controller, ControllerConstructor, ControllerContext } from '@/core/controller';

interface Route {
  name: string;
  ControllerClass: ControllerConstructor<Controller>;
  children?: Route[];
}

type RootRoute = Omit<Route, 'name'>;

export class Router {
  private root: Route;
  private history: string[] = [];

  public get currentRoute(): Route {
    const pathname = this.history[this.history.length - 1];

    const route = this.resolve(pathname);

    if (!route) {
      throw new Error(`Route not found: ${pathname}`);
    }

    return route;
  }

  constructor (config: RootRoute) {
    this.root = { name: '', ...config };

    this.history.push(this.root.name);
  }

  public navigate(pathname: string) {
    const route = this.resolve(pathname);

    if (!route) {
      throw new Error(`Route not found: ${pathname}`);
    }

    this.history.push(pathname);
  }

  public back() {
    this.history.pop();

    if (this.history.length === 0) {
      this.history.push(this.root.name);
    }
  }

  public resolve(pathname: string): Route | null {
    const segments = pathname.split('/');

    const traverse = (
      current: Route,
      depth: number
    ): Route | null => {
      if (depth >= segments.length - 1) {
        return current;
      }

      const segment = segments[depth + 1];
      const child = current.children?.find(r => r.name === segment);

      if (!child) {
        return null;
      }

      return traverse(child, depth + 1);
    };

    return traverse(this.root, 0);
  }

  public async invoke(context: ControllerContext) {
    const { ControllerClass } = this.currentRoute;

    const controller = new ControllerClass(context);

    await controller.run();
  }
}