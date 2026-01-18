import { View } from '@/core/view/View';
import { SalesManager, SalesManagerStats } from '@/modules/sales-manager/SalesManager.entity';

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

  showSalesManagerStats(stats: SalesManagerStats[]): void {
    this.table(stats, {
      columns: [
        ['Company ID', 'companyId'],
        ['Sales Manager', 'salesManagerName'],
        ['Leads Assigned', 'leadsAssigned'],
        ['Leads Won', 'leadsWon'],
        ['Conversion Rate (%)', ({ conversionRate }) => (conversionRate * 100).toFixed(2)],
      ],
    });
  }
}
