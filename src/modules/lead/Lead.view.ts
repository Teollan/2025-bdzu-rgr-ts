import { View } from '@/core/view/View';
import { Lead } from '@/modules/lead/Lead.entity';

export class LeadView extends View {
  one(lead: Lead): void {
    this.io.object(lead);
  }

  many(leads: Lead[]): void {
    this.io.table(leads);
  }
}
