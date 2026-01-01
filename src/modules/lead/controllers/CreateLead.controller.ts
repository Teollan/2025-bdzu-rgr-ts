import { Controller } from "@/core/controller";
import { LeadRepository } from "@/modules/lead/model";

export interface CreateLeadArgs {
  companyId: number;
  customerId: number;
  status: string;
}

type Args = CreateLeadArgs;

export class CreateLeadController extends Controller<Args> {
  private repository = new LeadRepository();

  async run(args: Args): Promise<void> {
    const lead = await this.repository.createLead(
      args.companyId,
      args.customerId,
      args.status
    );

    console.log(`Lead created with id ${lead.id}`);
  }
}
