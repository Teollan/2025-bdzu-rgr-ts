import { ActionController } from '@/core/controller/ActionController';
import { SalesManagerRepository } from "@/modules/sales-manager/model";
import { SalesManagerView } from '@/modules/sales-manager/view/SalesManager.view';

export class CreateSalesManagerController extends ActionController {
  private salesManagerRepository = this.makeRepository(SalesManagerRepository);
  private salesManagerView = this.makeView(SalesManagerView);

  async run(): Promise<void> {
    const { companyId } = await this.io.ask({
      name: 'companyId',
      type: 'number',
      message: 'Enter company ID:',
    });

    if (!companyId) {
      this.io.say('Sales manager creation cancelled.');

      return;
    }

    const { firstName } = await this.io.ask({
      name: 'firstName',
      type: 'text',
      message: 'Enter first name:',
    });

    if (!firstName) {
      this.io.say('Sales manager creation cancelled.');

      return;
    }

    const { lastName } = await this.io.ask({
      name: 'lastName',
      type: 'text',
      message: 'Enter last name:',
    });

    if (!lastName) {
      this.io.say('Sales manager creation cancelled.');

      return;
    }

    const salesManager = await this.salesManagerRepository.create({
      companyId,
      firstName,
      lastName,
    });

    this.io.say(`Sales manager created with id ${salesManager.id}`);
    this.salesManagerView.one(salesManager);
  }
}
