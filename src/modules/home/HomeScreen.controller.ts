import { App } from '@/core/app/App';
import { Controller } from '@/core/controller/Controller';

export class HomeScreenController extends Controller {
  public async run(): Promise<void> {
    const { route } = await this.ask({
      name: 'route',
      type: 'select',
      message: 'What would you like to do?',
      choices: [
        {
          title: 'Manage Companies',
          value: '/company',
        },
        {
          title: 'Manage Customers',
          value: '/customer',
        },
        {
          title: 'Manage Leads',
          value: '/lead',
        },
        {
          title: 'Manage Sales Managers',
          value: '/sales-manager',
        },
        {
          title: 'Exit',
          value: null,
        },
      ],
    });

    if (!route) {
      await App.stop();
    }

    this.router.navigate(route);
  }
}