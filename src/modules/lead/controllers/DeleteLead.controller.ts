import { Controller } from "@/core/controller";
import { LeadRepository } from "@/modules/lead/model";

export interface DeleteLeadArgs {
  id: number;
}

type Args = DeleteLeadArgs;

export class DeleteLeadController extends Controller<Args> {
  private repository = new LeadRepository();

  async run(args: Args): Promise<void> {
    const lead = await this.repository.deleteLead(args.id);

    console.log(`Lead ${lead.id} deleted successfully`);
  }
}
