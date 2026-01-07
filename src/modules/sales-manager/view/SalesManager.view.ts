import { View } from '@/core/view/View';
import { SalesManager } from '@/modules/sales-manager/model';

export class SalesManagerView extends View {
  one(salesManager: SalesManager): void {
    this.io.object(salesManager);
  }

  many(salesManagers: SalesManager[]): void {
    this.io.table(salesManagers);
  }
}
