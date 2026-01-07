import { ActionController } from '@/core/controller/ActionController';
import { SalesManagerRepository } from "@/modules/sales-manager/model";
import { SalesManagerView } from '@/modules/sales-manager/view/SalesManager.view';

export class UpdateSalesManagerController extends ActionController {
  private salesManagerRepository = this.makeRepository(SalesManagerRepository);
  private salesManagerView = this.makeView(SalesManagerView);

  async run(): Promise<void> {
    const { id } = await this.io.ask({
      name: 'id',
      type: 'number',
      message: 'Enter sales manager ID to update:',
      min: 1,
    });

    if (!id) {
      this.io.say('Update cancelled.');

      return;
    }

    const { companyId } = await this.io.ask({
      name: 'companyId',
      type: 'number',
      message: 'Enter new company ID (leave empty to skip):',
    });

    const { firstName } = await this.io.ask({
      name: 'firstName',
      type: 'text',
      message: 'Enter new first name (leave empty to skip):',
    });

    const { lastName } = await this.io.ask({
      name: 'lastName',
      type: 'text',
      message: 'Enter new last name (leave empty to skip):',
    });

    const updates: Record<string, string | number> = {};

    if (companyId) updates.companyId = companyId;
    if (firstName) updates.firstName = firstName;
    if (lastName) updates.lastName = lastName;

    if (Object.keys(updates).length === 0) {
      this.io.say('No changes made.');

      return;
    }

    const salesManager = await this.salesManagerRepository.update(id, updates);

    this.io.say(`Sales manager ${salesManager.id} updated successfully`);
    this.salesManagerView.one(salesManager);
  }
}
