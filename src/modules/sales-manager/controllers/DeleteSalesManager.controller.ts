import { Controller } from "@/core/controller";
import { SalesManagerRepository } from "@/modules/sales-manager/model";
import { showSalesManager } from '@/modules/sales-manager/view';

export interface DeleteSalesManagerArgs {
  id: number;
}

type Args = DeleteSalesManagerArgs;

export class DeleteSalesManagerController extends Controller<Args> {
  private repository = new SalesManagerRepository();

  async run({ id }: Args): Promise<void> {
    const salesManager = await this.repository.deleteSalesManager(id);

    console.log(`Sales manager ${salesManager.id} deleted successfully`);
    showSalesManager(salesManager);
  }
}
