import { ActionController } from '@/core/controller/ActionController';
import { SalesManagerRepository } from "@/modules/sales-manager/model";
import { showSalesManagers } from "@/modules/sales-manager/view/showSalesManagers.view";

export class ReadAllSalesManagersController extends ActionController {
  private repository = this.makeRepository(SalesManagerRepository);

  async run(): Promise<void> {
    const salesManagers = await this.repository.getAllSalesManagers({});

    if (salesManagers.length === 0) {
      console.log("No sales managers found.");

      return;
    }

    console.log("Sales managers found:");
    showSalesManagers(salesManagers);
  }
}
