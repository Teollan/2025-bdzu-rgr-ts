import { Controller } from "@/core/controller";
import { SalesManagerRepository } from "@/modules/sales-manager/model";

export interface UpdateSalesManagerArgs {
  id: number;
  companyId?: number;
  firstName?: string;
  lastName?: string;
}

type Args = UpdateSalesManagerArgs;

export class UpdateSalesManagerController extends Controller<Args> {
  private repository = new SalesManagerRepository();

  async run(args: Args): Promise<void> {
    const salesManager = await this.repository.updateSalesManager(
      args.id,
      args.companyId,
      args.firstName,
      args.lastName
    );

    console.log(`Sales manager ${salesManager.id} updated successfully`);
  }
}
