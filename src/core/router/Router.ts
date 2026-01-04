interface Route {
  name: string;
  children?: Route[];
}

export class Router {
  private routes: string[] = [];

  private root: Route;

  constructor (config: Route) {
    this.root = config;
  }

  public navigate(route: string): void {
    this.routes.push(route);
  }

  public back(): void {
    this.routes.pop();
  }
}