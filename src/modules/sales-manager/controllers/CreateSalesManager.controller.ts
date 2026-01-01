import { Controller } from "@/core/controller";
import { SalesManagerRepository } from "@/modules/sales-manager/model";
import { showSalesManager } from '@/modules/sales-manager/view';

export interface CreateSalesManagerArgs {
  companyId: number;
  firstName: string;
  lastName: string;
}

type Args = CreateSalesManagerArgs;

export class CreateSalesManagerController extends Controller<Args> {
  private repository = new SalesManagerRepository();

  async run(args: Args): Promise<void> {
    const salesManager = await this.repository.createSalesManager(args);

    console.log(`Sales manager created with id ${salesManager.id}`);
    showSalesManager(salesManager);
  }
}
