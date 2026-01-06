import { ActionController } from '@/core/controller/ActionController';
import { SalesManagerRepository } from "@/modules/sales-manager/model";
import { showSalesManager } from '@/modules/sales-manager/view/showSalesManager.view';

export class UpdateSalesManagerController extends ActionController {
  private repository = this.makeRepository(SalesManagerRepository);

  async run(): Promise<void> {
    const { id } = await this.app.ask({
      name: 'id',
      type: 'number',
      message: 'Enter sales manager ID to update:',
      min: 1,
    });

    if (!id) {
      console.log('Update cancelled.');

      return;
    }

    const { companyId } = await this.app.ask({
      name: 'companyId',
      type: 'number',
      message: 'Enter new company ID (leave empty to skip):',
    });

    const { firstName } = await this.app.ask({
      name: 'firstName',
      type: 'text',
      message: 'Enter new first name (leave empty to skip):',
    });

    const { lastName } = await this.app.ask({
      name: 'lastName',
      type: 'text',
      message: 'Enter new last name (leave empty to skip):',
    });

    const updates: Record<string, string | number> = {};

    if (companyId) updates.companyId = companyId;
    if (firstName) updates.firstName = firstName;
    if (lastName) updates.lastName = lastName;

    if (Object.keys(updates).length === 0) {
      console.log('No changes made.');

      return;
    }

    const salesManager = await this.repository.updateSalesManager(id, updates);

    console.log(`Sales manager ${salesManager.id} updated successfully`);
    showSalesManager(salesManager);
  }
}
