import { Controller } from '@/core/controller';
import { LeadRepository } from '@/modules/lead/Lead.repository';
import { LeadStatus, UpdateLeadFields } from '@/modules/lead/Lead.entity';
import { LeadView } from '@/modules/lead/Lead.view';

export class LeadController extends Controller {
  private repository = this.makeRepository(LeadRepository);
  private view = this.makeView(LeadView);

  public async run(): Promise<void> {
    const { action } = await this.io.ask({
      name: 'action',
      type: 'select',
      message: 'Managing Leads. What would you like to do?',
      choices: [
        { 
          title: 'List all',
          value: () => this.list(),
        },
        {
          title: 'Find by ID',
          value: () => this.find(),
        },
        { 
          title: 'Create',
          value: () => this.create(),
        },
        { 
          title: 'Update',
          value: () => this.update(),
        },
        { 
          title: 'Delete',
          value: () => this.delete(),
        },
        { 
          title: 'Go Back',
          value: () => this.router.back(),
        },
      ],
    });

    await action();
  }

  private list = async (): Promise<void> => {
    let result = await this.repository.list();

    while (true) {
      const { items, limit, offset, next, prev } = result;
      const page = Math.floor(offset / limit) + 1;

      if (items.length === 0) {
        this.io.say('No leads found.');

        return;
      }

      this.io.say(`Leads found (page ${page}):`);
      this.view.many(items);

      const { action } = await this.io.ask({
        name: 'action',
        type: 'select',
        message: 'What would you like to do next?',
        choices: [
          {
            title: 'Previous Page',
            value: prev,
            disabled: !prev,
          },
          {
            title: 'Next Page',
            value: next,
            disabled: !next,
          },
          {
            title: 'Done',
            value: null,
          },
        ],
      });

      if (!action) {
        break;
      }

      result = await action();
    }
  }

  private find = async (): Promise<void> => {
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

    const lead = await this.repository.findById(id);

    if (!lead) {
      this.io.say(`Lead with id ${id} not found.`);

      return;
    }

    this.view.one(lead);
  }

  private create = async (): Promise<void> => {
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

    const lead = await this.repository.create({
      companyId,
      customerId,
      status,
    });

    this.io.say(`Lead created with id ${lead.id}`);
    this.view.one(lead);
  }

  private update = async (): Promise<void> => {
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

    const lead = await this.repository.update(id, updates);

    this.io.say(`Lead ${lead.id} updated successfully`);
    this.view.one(lead);
  }

  private delete = async (): Promise<void> => {
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

    const lead = await this.repository.delete(id);

    this.io.say(`Lead ${lead.id} deleted successfully`);
    this.view.one(lead);
  }
}
