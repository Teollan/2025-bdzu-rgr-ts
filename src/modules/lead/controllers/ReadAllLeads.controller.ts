import { ActionController } from '@/core/controller/ActionController';
import { LeadRepository } from "@/modules/lead/model";
import { LeadView } from '@/modules/lead/view/Lead.view';

export class ReadAllLeadsController extends ActionController {
  private leadRepository = this.makeRepository(LeadRepository);
  private leadView = this.makeView(LeadView);

  async run(): Promise<void> {
    const leads = await this.leadRepository.list();

    if (leads.length === 0) {
      this.io.say("No leads found.");

      return;
    }

    this.io.say("Leads found:");
    this.leadView.many(leads);
  }
}
