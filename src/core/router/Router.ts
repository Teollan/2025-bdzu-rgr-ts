import { Controller } from '@/core/controller';

interface Route {
  name: string;
  controller: Controller;
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

  public navigate(pathname: string): void {
    const route = this.resolve(pathname);

    if (!route) {
      throw new Error(`Route not found: ${pathname}`);
    }

    this.history.push(pathname);
  }

  public back(): void {
    this.history.pop();

    if (this.history.length === 0) {
      this.history.push(this.root.name);
    }
  }

  private resolve(pathname: string): Route | null {
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
}