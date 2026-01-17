import { View } from '@/core/view/View';
import { Lead, LeadCompanySalesManager } from '@/modules/lead/Lead.entity';

export class LeadView extends View {
  showLead(lead: Lead): void {
    this.object(lead);
  }

  showLeads(leads: Lead[]): void {
    this.table(leads, {
      columns: [
        ['ID', 'id'],
        ['Company ID', 'companyId'],
        ['Customer ID', 'customerId'],
        ['Status', 'status'],
        ['Created At', 'createdAt'],
      ],
    });
  }

  showAssignedLeads(items: LeadCompanySalesManager[]): void {
    this.table(items, {
      columns: [
        ['Lead ID', 'leadId'],
        ['Company Name', 'companyName'],
        ['Sales Manager Name', 'salesManagerName'],
      ],
    });
  }
}
