import { ActionController } from '@/core/controller/ActionController';
import { SalesManagerRepository } from "@/modules/sales-manager/model";
import { showSalesManager } from '@/modules/sales-manager/view/showSalesManager.view';

export class CreateSalesManagerController extends ActionController {
  private repository = this.makeRepository(SalesManagerRepository);

  async run(): Promise<void> {
    const { companyId } = await this.app.ask({
      name: 'companyId',
      type: 'number',
      message: 'Enter company ID:',
    });

    if (!companyId) {
      console.log('Sales manager creation cancelled.');

      return;
    }

    const { firstName } = await this.app.ask({
      name: 'firstName',
      type: 'text',
      message: 'Enter first name:',
    });

    if (!firstName) {
      console.log('Sales manager creation cancelled.');

      return;
    }

    const { lastName } = await this.app.ask({
      name: 'lastName',
      type: 'text',
      message: 'Enter last name:',
    });

    if (!lastName) {
      console.log('Sales manager creation cancelled.');

      return;
    }

    const salesManager = await this.repository.createSalesManager({
      companyId,
      firstName,
      lastName,
    });

    console.log(`Sales manager created with id ${salesManager.id}`);
    showSalesManager(salesManager);
  }
}
