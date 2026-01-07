import { NavigationController } from '@/core/controller/NavigationController';

export class SelectLeadActionController extends NavigationController {
  async run(): Promise<void> {
    const { route } = await this.io.ask({
      name: 'route',
      type: 'select',
      message: 'You are managing Leads. What would you like to do?',
      choices: [
        { title: 'List', value: 'app/lead/list' },
        { title: 'Find', value: 'app/lead/find' },
        { title: 'Create', value: 'app/lead/create' },
        { title: 'Update', value: 'app/lead/update' },
        { title: 'Delete', value: 'app/lead/delete' },
        { title: 'Go Back', value: null },
      ],
    });

    if (!route) {
      await this.router.back();
    }

    await this.router.navigate(route);
  }
}
