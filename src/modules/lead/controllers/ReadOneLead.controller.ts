import { ActionController } from '@/core/controller/ActionController';
import { LeadRepository } from "@/modules/lead/model";
import { showLead } from "@/modules/lead/view/showLead.view";

export class ReadOneLeadController extends ActionController {
  private repository = this.makeRepository(LeadRepository);

  async run(): Promise<void> {
    const { id } = await this.app.ask({
      name: 'id',
      type: 'number',
      message: 'Enter lead ID:',
      min: 1,
    });

    if (!id) {
      console.log('Cancelled.');

      return;
    }

    const lead = await this.repository.findLeadById(id);

    if (!lead) {
      console.log(`Lead with id ${id} not found.`);

      return;
    }

    showLead(lead);
  }
}
