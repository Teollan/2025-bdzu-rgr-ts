import { Controller } from '@/core/controller';

export class HomeScreenController extends Controller {
  public async run(): Promise<void> {
    const { route } = await this.app.ask({
      name: 'route',
      type: 'select',
      message: 'What would you like to do?',
      choices: [
        { title: 'Manage Companies', value: '~/company' },
        { title: 'Manage Customers', value: '~/customer' },
        { title: 'Manage Leads', value: '~/lead' },
        { title: 'Manage Sales Managers', value: '~/sales-manager' },
        { title: 'Exit', value: null }, 
      ],
    });

    if (!route) {
      await this.app.stop();
    }

    await this.app.router.navigate(route);
  }
}