import { View } from '@/core/view/View';
import { Lead, LeadCompanySalesManager } from '@/modules/lead/Lead.entity';

export class LeadView extends View {
  one(lead: Lead): void {
    this.io.object(lead);
  }

  many(leads: Lead[]): void {
    this.io.table(leads);
  }

  manyAssigned(items: LeadCompanySalesManager[]): void {
    this.io.table(items);
  }
}
