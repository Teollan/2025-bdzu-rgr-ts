import { Controller } from '@/core/controller/Controller';

export abstract class NavigationController extends Controller {
  public async invoke(): Promise<void> {
    await this.run();
  }
}