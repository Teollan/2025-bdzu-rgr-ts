import { NavigationController } from '@/core/controller/NavigationController';

export class SelectCustomerActionController extends NavigationController {
  async run(): Promise<void> {
    const { route } = await this.io.ask({
      name: 'route',
      type: 'select',
      message: 'You are managing Customers. What would you like to do?',
      choices: [
        { title: 'List', value: 'app/customer/list' },
        { title: 'Find', value: 'app/customer/find' },
        { title: 'Create', value: 'app/customer/create' },
        { title: 'Update', value: 'app/customer/update' },
        { title: 'Delete', value: 'app/customer/delete' },
        { title: 'Go Back', value: null },
      ],
    });

    if (!route) {
      await this.router.back();
    }

    await this.router.navigate(route);
  }
}
