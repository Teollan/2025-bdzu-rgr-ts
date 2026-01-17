import { Controller } from '@/core/controller/Controller';
import { LeadRepository } from '@/modules/lead/Lead.repository';
import { LeadStatus, UpdateLeadFields } from '@/modules/lead/Lead.entity';
import { LeadView } from '@/modules/lead/Lead.view';

export class LeadController extends Controller {
  private repository = this.makeRepository(LeadRepository);
  private view = this.makeView(LeadView);

  public async run(): Promise<void> {
    const { action } = await this.ask({
      name: 'action',
      type: 'select',
      message: 'Managing Leads. What would you like to do?',
      choices: [
        { title: 'List all', value: () => this.list() },
        { title: 'Find by ID', value: () => this.find() },
        { title: 'Assign Leads to Sales Managers', value: () => this.assignLeads() },
        { title: 'Create', value: () => this.create() },
        { title: 'Create Random', value: () => this.createRandom() },
        { title: 'Update', value: () => this.update() },
        { title: 'Delete', value: () => this.delete() },
        { title: 'Go Back', value: null },
      ],
    });

    if (!action) {
      this.router.back();
    } else {
      await action();
    }
  }

  private list = async (): Promise<void> => {
    const result = await this.repository.list();

    await this.browsePages({
      data: result,
      onPage: (items, page) => {
        this.view.say(`Leads found (page ${page}):`);
        this.view.showLeads(items);
      },
      onEmptyPage: () => this.view.say('No leads found.'),
    });
  }

  private find = async (): Promise<void> => {
    const { id } = await this.ask({
      name: 'id',
      type: 'number',
      message: 'Enter lead ID:',
      min: 1,
    });

    if (!id) {
      this.view.say('Cancelled.');

      return;
    }

    const lead = await this.repository.findById(id);

    if (!lead) {
      this.view.say(`Lead with id ${id} not found.`);

      return;
    }

    this.view.showLead(lead);
  }

  private assignLeads = async (): Promise<void> => {
    const result = await this.repository.assignLeadsToSalesManagers();

    await this.browsePages({
      data: result,
      onPage: (items, page) => {
        this.view.say(`Assigned leads to sales managers (page ${page}):`);
        this.view.showAssignedLeads(items);
      },
      onEmptyPage: () => this.view.say('No unassigned leads found.'),
    });
  }

  private create = async (): Promise<void> => {
    const { companyId } = await this.ask({
      name: 'companyId',
      type: 'number',
      message: 'Enter company ID:',
      min: 1,
    });

    if (!companyId) {
      this.view.say('Lead creation cancelled.');

      return;
    }

    const { customerId } = await this.ask({
      name: 'customerId',
      type: 'number',
      message: 'Enter customer ID:',
      min: 1,
    });

    if (!customerId) {
      this.view.say('Lead creation cancelled.');

      return;
    }

    const { status } = await this.ask({
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

    this.view.say(`Lead created with id ${lead.id}`);
    this.view.showLead(lead);
  }

  private update = async (): Promise<void> => {
    const { id } = await this.ask({
      name: 'id',
      type: 'number',
      message: 'Enter lead ID to update:',
      min: 1,
    });

    if (!id) {
      this.view.say('Update cancelled.');

      return;
    }

    const { companyId } = await this.ask({
      name: 'companyId',
      type: 'number',
      message: 'Enter new company ID (leave empty to skip):',
    });

    const { customerId } = await this.ask({
      name: 'customerId',
      type: 'number',
      message: 'Enter new customer ID (leave empty to skip):',
    });

    const { status } = await this.ask({
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
      this.view.say('No changes made.');

      return;
    }

    const lead = await this.repository.update(id, updates);

    this.view.say(`Lead ${lead.id} updated successfully`);
    this.view.showLead(lead);
  }

  private createRandom = async (): Promise<void> => {
    const { count } = await this.ask({
      name: 'count',
      type: 'number',
      message: 'How many random leads to create?',
      min: 1,
      max: 250000,
    });

    if (!count) {
      this.view.say('Cancelled.');

      return;
    }

    const result = await this.repository.createRandom(count);

    await this.browsePages({
      data: result,
      onPage: (items, page) => {
        this.view.say(`Created ${count} leads (page ${page}):`);
        this.view.showLeads(items);
      },
    });
  }

  private delete = async (): Promise<void> => {
    const { id } = await this.ask({
      name: 'id',
      type: 'number',
      message: 'Enter lead ID to delete:',
      min: 1,
    });

    if (!id) {
      this.view.say('Deletion cancelled.');

      return;
    }

    const lead = await this.repository.delete(id);

    this.view.say(`Lead ${lead.id} deleted successfully`);
    this.view.showLead(lead);
  }
}
