import { ActionController } from '@/core/controller/ActionController';
import { LeadRepository, LeadStatus } from "@/modules/lead/model";
import { showLead } from '@/modules/lead/view/showLead.view';

export class CreateLeadController extends ActionController {
  private repository = this.makeRepository(LeadRepository);

  async run(): Promise<void> {
    const { companyId } = await this.app.ask({
      name: 'companyId',
      type: 'number',
      message: 'Enter company ID:',
      min: 1,
    });

    if (!companyId) {
      console.log('Lead creation cancelled.');

      return;
    }

    const { customerId } = await this.app.ask({
      name: 'customerId',
      type: 'number',
      message: 'Enter customer ID:',
      min: 1,
    });

    if (!customerId) {
      console.log('Lead creation cancelled.');

      return;
    }

    const { status } = await this.app.ask({
      name: 'status',
      type: 'select',
      message: 'Select lead status:',
      choices: [
        { title: 'Pending', value: LeadStatus.Pending },
        { title: 'In Progress', value: LeadStatus.InProgress },
        { title: 'Won', value: LeadStatus.Won },
        { title: 'Lost', value: LeadStatus.Lost },
      ],
    });

    const lead = await this.repository.createLead({
      companyId,
      customerId,
      status,
    });

    console.log(`Lead created with id ${lead.id}`);
    showLead(lead);
  }
}
