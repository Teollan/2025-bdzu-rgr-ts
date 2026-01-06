import { NavigationController } from '@/core/controller/NavigationController';

export class SelectSalesManagerActionController extends NavigationController {
  async run(): Promise<void> {
    const { route } = await this.app.ask({
      name: 'route',
      type: 'select',
      message: 'You are managing Sales Managers. What would you like to do?',
      choices: [
        { title: 'List', value: 'app/sales-manager/list' },
        { title: 'Find', value: 'app/sales-manager/find' },
        { title: 'Create', value: 'app/sales-manager/create' },
        { title: 'Update', value: 'app/sales-manager/update' },
        { title: 'Delete', value: 'app/sales-manager/delete' },
        { title: 'Go Back', value: null },
      ],
    });

    if (!route) {
      await this.app.router.back();
    }

    await this.app.router.navigate(route);
  }
}
