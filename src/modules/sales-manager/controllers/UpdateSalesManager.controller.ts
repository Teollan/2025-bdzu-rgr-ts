import { Controller } from "@/core/controller";
import { SalesManagerRepository } from "@/modules/sales-manager/model";
import { showSalesManager } from '@/modules/sales-manager/view';

export interface UpdateSalesManagerArgs {
  id: number;
  companyId?: number;
  firstName?: string;
  lastName?: string;
}

type Args = UpdateSalesManagerArgs;

export class UpdateSalesManagerController extends Controller<Args> {
  private repository = new SalesManagerRepository();

  async run({ id, ...updates }: Args): Promise<void> {
    const salesManager = await this.repository.updateSalesManager(id, updates);

    console.log(`Sales manager ${salesManager.id} updated successfully`);
    showSalesManager(salesManager);
  }
}
