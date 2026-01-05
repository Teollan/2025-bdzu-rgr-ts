import { Controller } from '@/core/controller';

interface Route {
  name: string;
  controller: Controller;
  children?: Route[];
}

type RootRoute = Omit<Route, 'name'>;

export class Router {
  private root: Route;
  private routes: Route[] = [];

  public get currentRoute(): Route {
    return this.routes[this.routes.length - 1];
  }

  constructor (config: RootRoute) {
    this.root = { name: '~', ...config };

    this.routes.push(this.root);
  }

  public navigate(pathname: string): void {
    const segments = pathname.split('/');

    const traverse = (current: Route = this.root, depth: number = 0): Route | null => {
      if (depth >= segments.length) {
        return current;
      }

      const segment = segments[depth];
      const child = current.children?.find(r => r.name === segment);

      if (!child) {
        return null;
      }

      return traverse(child, depth + 1);
    };

    const route = traverse();

    if (!route) {
      throw new Error(`Route not found: ${pathname}`);
    }

    this.routes.push(route);
  }

  public back(): void {
    this.routes.pop();
  }
}