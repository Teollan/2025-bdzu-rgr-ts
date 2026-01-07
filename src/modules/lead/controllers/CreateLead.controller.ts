import { ActionController } from '@/core/controller/ActionController';
import { LeadRepository, LeadStatus } from "@/modules/lead/model";
import { LeadView } from '@/modules/lead/view/Lead.view';

export class CreateLeadController extends ActionController {
  private leadRepository = this.makeRepository(LeadRepository);
  private leadView = this.makeView(LeadView);

  async run(): Promise<void> {
    const { companyId } = await this.io.ask({
      name: 'companyId',
      type: 'number',
      message: 'Enter company ID:',
      min: 1,
    });

    if (!companyId) {
      this.io.say('Lead creation cancelled.');

      return;
    }

    const { customerId } = await this.io.ask({
      name: 'customerId',
      type: 'number',
      message: 'Enter customer ID:',
      min: 1,
    });

    if (!customerId) {
      this.io.say('Lead creation cancelled.');

      return;
    }

    const { status } = await this.io.ask({
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

    const lead = await this.leadRepository.create({
      companyId,
      customerId,
      status,
    });

    this.io.say(`Lead created with id ${lead.id}`);
    this.leadView.one(lead);
  }
}
