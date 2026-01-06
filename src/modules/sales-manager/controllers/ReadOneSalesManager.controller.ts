import { ActionController } from '@/core/controller/ActionController';
import { SalesManagerRepository } from "@/modules/sales-manager/model";
import { showSalesManager } from "@/modules/sales-manager/view/showSalesManager.view";

export class ReadOneSalesManagerController extends ActionController {
  private repository = this.makeRepository(SalesManagerRepository);

  async run(): Promise<void> {
    const { id } = await this.app.ask({
      name: 'id',
      type: 'number',
      message: 'Enter sales manager ID:',
      min: 1,
    });

    if (!id) {
      console.log('Cancelled.');

      return;
    }

    const salesManager = await this.repository.findSalesManagerById(id);

    if (!salesManager) {
      console.log(`Sales manager with id ${id} not found.`);

      return;
    }

    showSalesManager(salesManager);
  }
}
