import { Router } from '@/core/router/Router';
import { Postgres } from '@/core/database';
import { InputOutput } from '@/core/io/InputOutput';

import { HomeScreenController } from '@/modules/home/HomeScreen.controller';
import { CompanyController } from '@/modules/company/Company.controller';
import { CustomerController } from '@/modules/customer/Customer.controller';
import { LeadController } from '@/modules/lead/Lead.controller';
import { SalesManagerController } from '@/modules/sales-manager/SalesManager.controller';

export abstract class App {
  private static io = new InputOutput();

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
      io,
      router,
    } = App;
    
    await db.connect();

    while (true) {
      try {
        const context = {
          db,
          io,
          router,
        };

        await router.invoke(context);
      } catch (error) {
        io.error('An error occurred:', error);
      }
    }
  }

  public static async stop() {
    await App.db.disconnect();

    App.io.say('Goodbye!');

    process.exit(0);
  }
}
