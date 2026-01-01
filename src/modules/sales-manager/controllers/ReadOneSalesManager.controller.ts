import { Controller } from "@/core/controller";
import { SalesManagerRepository } from "@/modules/sales-manager/model";
import { showSalesManager } from "@/modules/sales-manager/view";

export interface ReadOneSalesManagerArgs {
  id: number;
}

type Args = ReadOneSalesManagerArgs;

export class ReadOneSalesManagerController extends Controller<Args> {
  private repository = new SalesManagerRepository();

  async run(args: Args): Promise<void> {
    const salesManager = await this.repository.findSalesManagerById(args.id);

    if (!salesManager) {
      console.log(`Sales manager with id ${args.id} not found.`);

      return;
    }

    showSalesManager(salesManager);
  }
}
