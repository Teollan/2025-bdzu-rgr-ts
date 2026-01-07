import { ActionController } from '@/core/controller/ActionController';
import { LeadRepository } from "@/modules/lead/model";
import { LeadView } from '@/modules/lead/view/Lead.view';

export class ReadOneLeadController extends ActionController {
  private leadRepository = this.makeRepository(LeadRepository);
  private leadView = this.makeView(LeadView);

  async run(): Promise<void> {
    const { id } = await this.io.ask({
      name: 'id',
      type: 'number',
      message: 'Enter lead ID:',
      min: 1,
    });

    if (!id) {
      this.io.say('Cancelled.');

      return;
    }

    const lead = await this.leadRepository.findById(id);

    if (!lead) {
      this.io.say(`Lead with id ${id} not found.`);

      return;
    }

    this.leadView.one(lead);
  }
}
