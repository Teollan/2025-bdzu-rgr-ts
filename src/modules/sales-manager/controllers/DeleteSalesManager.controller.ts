import { ActionController } from '@/core/controller/ActionController';
import { SalesManagerRepository } from "@/modules/sales-manager/model";
import { showSalesManager } from '@/modules/sales-manager/view/showSalesManager.view';

export class DeleteSalesManagerController extends ActionController {
  private repository = this.makeRepository(SalesManagerRepository);

  async run(): Promise<void> {
    const { id } = await this.app.ask({
      name: 'id',
      type: 'number',
      message: 'Enter sales manager ID to delete:',
      min: 1,
    });

    if (!id) {
      console.log('Deletion cancelled.');

      return;
    }

    const salesManager = await this.repository.deleteSalesManager(id);

    console.log(`Sales manager ${salesManager.id} deleted successfully`);
    showSalesManager(salesManager);
  }
}
