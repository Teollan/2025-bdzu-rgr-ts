import { ActionController } from '@/core/controller/ActionController';
import { LeadRepository } from "@/modules/lead/model";
import { LeadView } from '@/modules/lead/view/Lead.view';

export class DeleteLeadController extends ActionController {
  private leadRepository = this.makeRepository(LeadRepository);
  private leadView = this.makeView(LeadView);

  async run(): Promise<void> {
    const { id } = await this.io.ask({
      name: 'id',
      type: 'number',
      message: 'Enter lead ID to delete:',
      min: 1,
    });

    if (!id) {
      this.io.say('Deletion cancelled.');

      return;
    }

    const lead = await this.leadRepository.delete(id);

    this.io.say(`Lead ${lead.id} deleted successfully`);
    this.leadView.one(lead);
  }
}
