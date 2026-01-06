import prompts from 'prompts';
import { Router } from '@/core/router/Router';
import { HomeScreenController } from '@/modules/home/controllers/HomeScreen.controller';
import { Postgres } from '@/core/database';

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

export class App {
  public readonly ask = prompts;

  public readonly router: Router;

  public readonly db: Postgres;

  private constructor(config: {
    db: Postgres;
  }) {
    this.db = config.db;

    this.router = new Router({
      controller: new HomeScreenController(this),
      children: [
        {
          name: "company",
          controller: new SelectCompanyActionController(this),
          children: [
            { name: "list", controller: new ListCompaniesController(this) },
            { name: "find", controller: new ReadOneCompanyController(this) },
            { name: "create", controller: new CreateCompanyController(this) },
            { name: "update", controller: new UpdateCompanyController(this) },
            { name: "delete", controller: new DeleteCompanyController(this) },
          ],
        },
        {
          name: "customer",
          controller: new SelectCustomerActionController(this),
          children: [
            { name: "list", controller: new ReadAllCustomersController(this) },
            { name: "find", controller: new ReadOneCustomerController(this) },
            { name: "create", controller: new CreateCustomerController(this) },
            { name: "update", controller: new UpdateCustomerController(this) },
            { name: "delete", controller: new DeleteCustomerController(this) },
          ],
        },
        {
          name: "lead",
          controller: new SelectLeadActionController(this),
          children: [
            { name: "list", controller: new ReadAllLeadsController(this) },
            { name: "find", controller: new ReadOneLeadController(this) },
            { name: "create", controller: new CreateLeadController(this) },
            { name: "update", controller: new UpdateLeadController(this) },
            { name: "delete", controller: new DeleteLeadController(this) },
          ],
        },
        {
          name: "sales-manager",
          controller: new SelectSalesManagerActionController(this),
          children: [
            { name: "list", controller: new ReadAllSalesManagersController(this) },
            { name: "find", controller: new ReadOneSalesManagerController(this) },
            { name: "create", controller: new CreateSalesManagerController(this) },
            { name: "update", controller: new UpdateSalesManagerController(this) },
            { name: "delete", controller: new DeleteSalesManagerController(this) },
          ],
        },
      ],
    });
  }

  public static async create(): Promise<App> {
    const db = new Postgres();

    await db.connect();

    return new App({ db });
  }

  public async run(): Promise<string> {
    while (true) {
      try {
        const { controller } = this.router.currentRoute;

        await controller.invoke();
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
