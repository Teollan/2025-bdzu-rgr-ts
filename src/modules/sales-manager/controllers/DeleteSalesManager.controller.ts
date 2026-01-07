import { ActionController } from '@/core/controller/ActionController';
import { SalesManagerRepository } from "@/modules/sales-manager/model";
import { SalesManagerView } from '@/modules/sales-manager/view/SalesManager.view';

export class DeleteSalesManagerController extends ActionController {
  private salesManagerRepository = this.makeRepository(SalesManagerRepository);
  private salesManagerView = this.makeView(SalesManagerView);

  async run(): Promise<void> {
    const { id } = await this.io.ask({
      name: 'id',
      type: 'number',
      message: 'Enter sales manager ID to delete:',
      min: 1,
    });

    if (!id) {
      this.io.say('Deletion cancelled.');

      return;
    }

    const salesManager = await this.salesManagerRepository.delete(id);

    this.io.say(`Sales manager ${salesManager.id} deleted successfully`);
    this.salesManagerView.one(salesManager);
  }
}
