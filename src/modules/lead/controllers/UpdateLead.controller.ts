import { ActionController } from '@/core/controller/ActionController';
import { LeadRepository, LeadStatus, UpdateLeadFields } from "@/modules/lead/model";
import { LeadView } from '@/modules/lead/view/Lead.view';

export class UpdateLeadController extends ActionController {
  private leadRepository = this.makeRepository(LeadRepository);
  private leadView = this.makeView(LeadView);

  async run(): Promise<void> {
    const { id } = await this.io.ask({
      name: 'id',
      type: 'number',
      message: 'Enter lead ID to update:',
      min: 1,
    });

    if (!id) {
      this.io.say('Update cancelled.');

      return;
    }

    const { companyId } = await this.io.ask({
      name: 'companyId',
      type: 'number',
      message: 'Enter new company ID (leave empty to skip):',
    });

    const { customerId } = await this.io.ask({
      name: 'customerId',
      type: 'number',
      message: 'Enter new customer ID (leave empty to skip):',
    });

    const { status } = await this.io.ask({
      name: 'status',
      type: 'select',
      message: 'Select new status (or skip):',
      choices: [
        { title: 'Pending', value: LeadStatus.Pending },
        { title: 'In Progress', value: LeadStatus.InProgress },
        { title: 'Won', value: LeadStatus.Won },
        { title: 'Lost', value: LeadStatus.Lost },
        { title: 'Skip', value: null },
      ],
    });

    const updates: UpdateLeadFields = {};

    if (companyId) updates.companyId = companyId;
    if (customerId) updates.customerId = customerId;
    if (status) updates.status = status;

    if (Object.keys(updates).length === 0) {
      this.io.say('No changes made.');

      return;
    }

    const lead = await this.leadRepository.update(id, updates);

    this.io.say(`Lead ${lead.id} updated successfully`);
    this.leadView.one(lead);
  }
}
