import { ActionController } from '@/core/controller/ActionController';
import { LeadRepository } from "@/modules/lead/model";
import { showLeads } from "@/modules/lead/view/showLeads.view";

export class ReadAllLeadsController extends ActionController {
  private repository = this.makeRepository(LeadRepository);

  async run(): Promise<void> {
    const leads = await this.repository.getAllLeads({});

    if (leads.length === 0) {
      console.log("No leads found.");

      return;
    }

    console.log("Leads found:");
    showLeads(leads);
  }
}
