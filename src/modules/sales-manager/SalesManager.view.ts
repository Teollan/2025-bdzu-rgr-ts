import { View } from '@/core/view/View';
import { SalesManager } from '@/modules/sales-manager/SalesManager.entity';

export class SalesManagerView extends View {
  showSalesManager(salesManager: SalesManager): void {
    this.object(salesManager);
  }

  showSalesManagers(salesManagers: SalesManager[]): void {
    this.table(salesManagers, {
      columns: [
        ['ID', 'id'],
        ['Company ID', 'companyId'],
        ['First Name', 'firstName'],
        ['Last Name', 'lastName'],
      ],
    });
  }
}
