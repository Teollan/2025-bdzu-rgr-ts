import { Controller } from "@/core/controller";
import { LeadRepository, LeadStatus } from "@/modules/lead/model";
import { showLead } from '@/modules/lead/view';

export interface CreateLeadArgs {
  companyId: number;
  customerId: number;
  status: LeadStatus;
}

type Args = CreateLeadArgs;

export class CreateLeadController extends Controller<Args> {
  private repository = new LeadRepository();

  async run(args: Args): Promise<void> {
    const lead = await this.repository.createLead(args);

    console.log(`Lead created with id ${lead.id}`);
    showLead(lead);
  }
}
