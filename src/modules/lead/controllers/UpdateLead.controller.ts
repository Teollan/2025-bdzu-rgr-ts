import { Controller } from "@/core/controller";
import { LeadRepository, LeadStatus } from "@/modules/lead/model";
import { showLead } from '@/modules/lead/view';

export interface UpdateLeadArgs {
  id: number;
  companyId?: number;
  customerId?: number;
  status?: LeadStatus;
}

type Args = UpdateLeadArgs;

export class UpdateLeadController extends Controller<Args> {
  private repository = new LeadRepository();

  async run({ id, ...updates }: Args): Promise<void> {
    const lead = await this.repository.updateLead(id, updates);

    console.log(`Lead ${lead.id} updated successfully`);
    showLead(lead);
  }
}
