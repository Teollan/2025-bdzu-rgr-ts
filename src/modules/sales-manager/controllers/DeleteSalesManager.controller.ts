import { Controller } from "@/core/controller";
import { SalesManagerRepository } from "@/modules/sales-manager/model";

export interface DeleteSalesManagerArgs {
  id: number;
}

type Args = DeleteSalesManagerArgs;

export class DeleteSalesManagerController extends Controller<Args> {
  private repository = new SalesManagerRepository();

  async run(args: Args): Promise<void> {
    const salesManager = await this.repository.deleteSalesManager(args.id);

    console.log(`Sales manager ${salesManager.id} deleted successfully`);
  }
}
