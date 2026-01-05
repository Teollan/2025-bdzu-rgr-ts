import prompts from 'prompts';
import { Router } from '@/core/router/Router';
import { HomeScreenController } from '@/modules/home/controllers/HomeScreen.controller';
import { Postgres } from '@/core/database';

export class App {
  public readonly ask = prompts;

  public readonly router: Router;

  public readonly db: Postgres;

  constructor() {
    this.db = new Postgres();

    this.router = new Router({
      controller: new HomeScreenController(this),
    });
  }

  public async init(): Promise<void> {
    await this.db.connect();
  }

  public async run(): Promise<string> {
    while (true) {
      try {
        await this.router.currentRoute.controller.run();
      } catch (error) {
        console.error('An error occurred:', error);
      }
    }
  }

  public stop() {
    console.log('Goodbye!');
    process.exit(0);
  }
}