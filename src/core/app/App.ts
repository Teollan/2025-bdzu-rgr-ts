import { Router } from '@/core/router/Router';
import { Postgres } from '@/core/database';

import { HomeScreenController } from '@/modules/home/HomeScreen.controller';
import { CompanyController } from '@/modules/company/Company.controller';
import { CustomerController } from '@/modules/customer/Customer.controller';
import { LeadController } from '@/modules/lead/Lead.controller';
import { SalesManagerController } from '@/modules/sales-manager/SalesManager.controller';

export abstract class App {
  private static db: Postgres = new Postgres();

  private static router: Router = new Router({
    ControllerClass: HomeScreenController,
    children: [
      {
        name: 'company',
        ControllerClass: CompanyController
      },
      {
        name: 'customer',
        ControllerClass: CustomerController,
      },
      {
        name: 'lead',
        ControllerClass: LeadController,
      },
      {
        name: 'sales-manager',
        ControllerClass: SalesManagerController,
      },
    ],
  });

  public static async start(): Promise<App> {
    const {
      db,
      router,
    } = App;
    
    await db.connect();

    while (true) {
      try {
        const context = {
          db,
          router,
        };

        await router.invoke(context);
      } catch (error) {
        console.error('An error occurred:', error);
      }
    }
  }

  public static async stop() {
    await App.db.disconnect();

    console.log('Goodbye!');

    process.exit(0);
  }
}
