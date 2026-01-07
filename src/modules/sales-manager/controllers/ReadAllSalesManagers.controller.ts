import { ActionController } from '@/core/controller/ActionController';
import { SalesManagerRepository } from "@/modules/sales-manager/model";
import { SalesManagerView } from '@/modules/sales-manager/view/SalesManager.view';

export class ReadAllSalesManagersController extends ActionController {
  private salesManagerRepository = this.makeRepository(SalesManagerRepository);
  private salesManagerView = this.makeView(SalesManagerView);

  async run(): Promise<void> {
    const salesManagers = await this.salesManagerRepository.list();

    if (salesManagers.length === 0) {
      this.io.say("No sales managers found.");

      return;
    }

    this.io.say("Sales managers found:");
    this.salesManagerView.many(salesManagers);
  }
}
