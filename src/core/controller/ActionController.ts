import { Controller } from '@/core/controller/Controller';

export abstract class ActionController extends Controller {
  public async invoke(): Promise<void> {
    await this.run();

    this.app.router.back();
  }
}