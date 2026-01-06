import { ActionController } from '@/core/controller/ActionController';
import { LeadRepository, LeadStatus, UpdateLeadFields } from "@/modules/lead/model";
import { showLead } from '@/modules/lead/view/showLead.view';

export class UpdateLeadController extends ActionController {
  private repository = this.makeRepository(LeadRepository);

  async run(): Promise<void> {
    const { id } = await this.app.ask({
      name: 'id',
      type: 'number',
      message: 'Enter lead ID to update:',
      min: 1,
    });

    if (!id) {
      console.log('Update cancelled.');

      return;
    }

    const { companyId } = await this.app.ask({
      name: 'companyId',
      type: 'number',
      message: 'Enter new company ID (leave empty to skip):',
    });

    const { customerId } = await this.app.ask({
      name: 'customerId',
      type: 'number',
      message: 'Enter new customer ID (leave empty to skip):',
    });

    const { status } = await this.app.ask({
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
      console.log('No changes made.');

      return;
    }

    const lead = await this.repository.updateLead(id, updates);

    console.log(`Lead ${lead.id} updated successfully`);
    showLead(lead);
  }
}
