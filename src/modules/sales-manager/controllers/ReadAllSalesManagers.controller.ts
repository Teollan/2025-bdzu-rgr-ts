import { Controller } from "@/core/controller";
import { SalesManagerRepository } from "@/modules/sales-manager/model";
import { showSalesManagers } from "@/modules/sales-manager/view";

export interface ReadAllSalesManagersArgs {
  limit: number;
  offset: number;
}

type Args = ReadAllSalesManagersArgs;

export class ReadAllSalesManagersController extends Controller<Args> {
  private repository = new SalesManagerRepository();

  async run(args: Args): Promise<void> {
    const salesManagers = await this.repository.getAllSalesManagers(args);

    if (salesManagers.length === 0) {
      console.log("No sales managers found.");

      return;
    }

    console.log("Sales managers found:");
    showSalesManagers(salesManagers);
  }
}
