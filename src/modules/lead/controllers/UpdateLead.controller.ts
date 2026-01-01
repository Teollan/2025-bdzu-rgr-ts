import { Controller } from "@/core/controller";
import { LeadRepository } from "@/modules/lead/model";

export interface UpdateLeadArgs {
  id: number;
  companyId?: number;
  customerId?: number;
  status?: string;
}

type Args = UpdateLeadArgs;

export class UpdateLeadController extends Controller<Args> {
  private repository = new LeadRepository();

  async run(args: Args): Promise<void> {
    const lead = await this.repository.updateLead(
      args.id,
      args.companyId,
      args.customerId,
      args.status
    );

    console.log(`Lead ${lead.id} updated successfully`);
  }
}
