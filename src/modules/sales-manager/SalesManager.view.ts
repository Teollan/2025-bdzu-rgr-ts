import { View } from '@/core/view/View';
import { SalesManager } from '@/modules/sales-manager/SalesManager.entity';

export class SalesManagerView extends View {
  one(salesManager: SalesManager): void {
    this.io.object(salesManager);
  }

  many(salesManagers: SalesManager[]): void {
    this.io.table(salesManagers);
  }
}
