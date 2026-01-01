import { Controller } from "@/core/controller";
import { LeadRepository } from "@/modules/lead/model";
import { showLead } from "@/modules/lead/view";

export interface ReadOneLeadArgs {
  id: number;
}

type Args = ReadOneLeadArgs;

export class ReadOneLeadController extends Controller<Args> {
  private repository = new LeadRepository();

  async run({ id }: Args): Promise<void> {
    const lead = await this.repository.findLeadById(id);

    if (!lead) {
      console.log(`Lead with id ${id} not found.`);

      return;
    }

    showLead(lead);
  }
}
