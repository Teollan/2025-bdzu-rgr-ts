import { ActionController } from '@/core/controller/ActionController';
import { LeadRepository } from "@/modules/lead/model";
import { showLead } from '@/modules/lead/view/showLead.view';

export class DeleteLeadController extends ActionController {
  private repository = this.makeRepository(LeadRepository);

  async run(): Promise<void> {
    const { id } = await this.app.ask({
      name: 'id',
      type: 'number',
      message: 'Enter lead ID to delete:',
      min: 1,
    });

    if (!id) {
      console.log('Deletion cancelled.');

      return;
    }

    const lead = await this.repository.deleteLead(id);

    console.log(`Lead ${lead.id} deleted successfully`);
    showLead(lead);
  }
}
