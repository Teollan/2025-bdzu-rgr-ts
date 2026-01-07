import { App } from '@/core/app/App';
import { NavigationController } from '@/core/controller/NavigationController';

export class HomeScreenController extends NavigationController {
  public async run(): Promise<void> {
    const { route } = await this.io.ask({
      name: 'route',
      type: 'select',
      message: 'What would you like to do?',
      choices: [
        { title: 'Manage Companies', value: '/company' },
        { title: 'Manage Customers', value: '/customer' },
        { title: 'Manage Leads', value: '/lead' },
        { title: 'Manage Sales Managers', value: '/sales-manager' },
        { title: 'Exit', value: null }, 
      ],
    });

    if (!route) {
      await App.stop();
    }

    await this.router.navigate(route);
  }
}