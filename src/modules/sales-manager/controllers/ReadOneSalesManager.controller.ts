import { ActionController } from '@/core/controller/ActionController';
import { SalesManagerRepository } from "@/modules/sales-manager/model";
import { SalesManagerView } from '@/modules/sales-manager/view/SalesManager.view';

export class ReadOneSalesManagerController extends ActionController {
  private salesManagerRepository = this.makeRepository(SalesManagerRepository);
  private salesManagerView = this.makeView(SalesManagerView);

  async run(): Promise<void> {
    const { id } = await this.io.ask({
      name: 'id',
      type: 'number',
      message: 'Enter sales manager ID:',
      min: 1,
    });

    if (!id) {
      this.io.say('Cancelled.');

      return;
    }

    const salesManager = await this.salesManagerRepository.findById(id);

    if (!salesManager) {
      this.io.say(`Sales manager with id ${id} not found.`);

      return;
    }

    this.salesManagerView.one(salesManager);
  }
}
