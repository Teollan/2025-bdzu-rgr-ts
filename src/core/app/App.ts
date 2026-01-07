import { Router } from '@/core/router/Router';
import { Postgres } from '@/core/database';
import { InputOutput } from '@/core/io/InputOutput';

// Home controller
import { HomeScreenController } from '@/modules/home/controllers/HomeScreen.controller';

// Company controllers
import { SelectCompanyActionController } from '@/modules/company/controllers/SelectCompanyAction.controller';
import { ListCompaniesController } from '@/modules/company/controllers/ListCompanies.controller';
import { CreateCompanyController } from '@/modules/company/controllers/CreateCompany.controller';
import { ReadOneCompanyController } from '@/modules/company/controllers/ReadOneCompany.controller';
import { UpdateCompanyController } from '@/modules/company/controllers/UpdateCompany.controller';
import { DeleteCompanyController } from '@/modules/company/controllers/DeleteCompany.controller';

// Customer controllers
import { SelectCustomerActionController } from '@/modules/customer/controllers/SelectCustomerAction.controller';
import { ReadAllCustomersController } from '@/modules/customer/controllers/ReadAllCustomers.controller';
import { ReadOneCustomerController } from '@/modules/customer/controllers/ReadOneCustomer.controller';
import { CreateCustomerController } from '@/modules/customer/controllers/CreateCustomer.controller';
import { UpdateCustomerController } from '@/modules/customer/controllers/UpdateCustomer.controller';
import { DeleteCustomerController } from '@/modules/customer/controllers/DeleteCustomer.controller';

// Lead controllers
import { SelectLeadActionController } from '@/modules/lead/controllers/SelectLeadAction.controller';
import { ReadAllLeadsController } from '@/modules/lead/controllers/ReadAllLeads.controller';
import { ReadOneLeadController } from '@/modules/lead/controllers/ReadOneLead.controller';
import { CreateLeadController } from '@/modules/lead/controllers/CreateLead.controller';
import { UpdateLeadController } from '@/modules/lead/controllers/UpdateLead.controller';
import { DeleteLeadController } from '@/modules/lead/controllers/DeleteLead.controller';

// Sales Manager controllers
import { SelectSalesManagerActionController } from '@/modules/sales-manager/controllers/SelectSalesManagerAction.controller';
import { ReadAllSalesManagersController } from '@/modules/sales-manager/controllers/ReadAllSalesManagers.controller';
import { ReadOneSalesManagerController } from '@/modules/sales-manager/controllers/ReadOneSalesManager.controller';
import { CreateSalesManagerController } from '@/modules/sales-manager/controllers/CreateSalesManager.controller';
import { UpdateSalesManagerController } from '@/modules/sales-manager/controllers/UpdateSalesManager.controller';
import { DeleteSalesManagerController } from '@/modules/sales-manager/controllers/DeleteSalesManager.controller';


export abstract class App {
  private static io = new InputOutput();

  private static db: Postgres = new Postgres();

  private static router: Router = new Router({
      ControllerClass: HomeScreenController,
      children: [
        {
          name: "company",
          ControllerClass: SelectCompanyActionController,
          children: [
            { name: "list", ControllerClass: ListCompaniesController },
            { name: "find", ControllerClass: ReadOneCompanyController },
            { name: "create", ControllerClass: CreateCompanyController },
            { name: "update", ControllerClass: UpdateCompanyController },
            { name: "delete", ControllerClass: DeleteCompanyController },
          ],
        },
        {
          name: "customer",
          ControllerClass: SelectCustomerActionController,
          children: [
            { name: "list", ControllerClass: ReadAllCustomersController },
            { name: "find", ControllerClass: ReadOneCustomerController },
            { name: "create", ControllerClass: CreateCustomerController },
            { name: "update", ControllerClass: UpdateCustomerController },
            { name: "delete", ControllerClass: DeleteCustomerController },
          ],
        },
        {
          name: "lead",
          ControllerClass: SelectLeadActionController,
          children: [
            { name: "list", ControllerClass: ReadAllLeadsController },
            { name: "find", ControllerClass: ReadOneLeadController },
            { name: "create", ControllerClass: CreateLeadController },
            { name: "update", ControllerClass: UpdateLeadController },
            { name: "delete", ControllerClass: DeleteLeadController },
          ],
        },
        {
          name: "sales-manager",
          ControllerClass: SelectSalesManagerActionController,
          children: [
            { name: "list", ControllerClass: ReadAllSalesManagersController },
            { name: "find", ControllerClass: ReadOneSalesManagerController },
            { name: "create", ControllerClass: CreateSalesManagerController },
            { name: "update", ControllerClass: UpdateSalesManagerController },
            { name: "delete", ControllerClass: DeleteSalesManagerController },
          ],
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
        const context = { db, io, router };

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
