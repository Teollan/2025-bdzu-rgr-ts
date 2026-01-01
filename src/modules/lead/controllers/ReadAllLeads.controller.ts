import { Controller } from "@/core/controller";
import { LeadRepository } from "@/modules/lead/model";
import { showLeads } from "@/modules/lead/view";

export interface ReadAllLeadsArgs {
  limit: number;
  offset: number;
}

type Args = ReadAllLeadsArgs;

export class ReadAllLeadsController extends Controller<Args> {
  private repository = new LeadRepository();

  async run(args: Args): Promise<void> {
    const leads = await this.repository.getAllLeads(args.limit, args.offset);

    if (leads.length === 0) {
      console.log("No leads found.");

      return;
    }

    console.log("Leads found:");
    showLeads(leads);
  }
}
