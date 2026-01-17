import { Controller } from '@/core/controller/Controller';
import { mandatory } from '@/lib/validation';
import { LeadRepository } from '@/modules/lead/Lead.repository';
import { LeadStatus } from '@/modules/lead/Lead.entity';
import { LeadView } from '@/modules/lead/Lead.view';
import { truthy } from '@/lib/functional';

export class LeadController extends Controller {
  private repository = this.makeRepository(LeadRepository);
  private view = this.makeView(LeadView);

  public async run(): Promise<void> {
    const input = await this.ask({
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
        { title: 'Go Back', value: () => this.router.back() },
      ],
    });

    if (!input) {
      this.router.back();

      return;
    }

    const { action } = input;

    await action();
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
    const input = await this.ask({
      name: 'id',
      type: 'number',
      message: 'Enter lead ID:',
      min: 1,
      validate: mandatory('Lead ID is required'),
    });

    if (!input) {
      this.view.say('Search cancelled.');

      return;
    }

    const { id } = input;

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
    const input = await this.ask([
      {
        name: 'companyId',
        type: 'number',
        message: 'Enter company ID:',
        min: 1,
        validate: mandatory('Company ID is required'),
      },
      {
        name: 'customerId',
        type: 'number',
        message: 'Enter customer ID:',
        min: 1,
        validate: mandatory('Customer ID is required'),
      },
      {
        name: 'status',
        type: 'select',
        message: 'Select lead status:',
        choices: [
          { title: 'Pending', value: LeadStatus.Pending },
          { title: 'In Progress', value: LeadStatus.InProgress },
          { title: 'Won', value: LeadStatus.Won },
          { title: 'Lost', value: LeadStatus.Lost },
        ],
      },
    ]);

    if (!input) {
      this.view.say('Lead creation cancelled.');

      return;
    }

    const lead = await this.repository.create(input);

    this.view.say(`Lead created with id ${lead.id}`);
    this.view.showLead(lead);
  }

  private update = async (): Promise<void> => {
    const input = await this.ask([
      {
        name: 'id',
        type: 'number',
        message: 'Enter lead ID to update:',
        min: 1,
        validate: mandatory('Lead ID is required'),
      },
      {
        name: 'companyId',
        type: 'number',
        message: 'Enter new company ID (leave empty to skip):',
        min: 1,
      },
      {
        name: 'customerId',
        type: 'number',
        message: 'Enter new customer ID (leave empty to skip):',
        min: 1,
      },
      {
        name: 'status',
        type: 'select',
        message: 'Select new status (or skip):',
        choices: [
          { title: 'Pending', value: LeadStatus.Pending },
          { title: 'In Progress', value: LeadStatus.InProgress },
          { title: 'Won', value: LeadStatus.Won },
          { title: 'Lost', value: LeadStatus.Lost },
          { title: 'Skip', value: undefined },
        ],
      },
    ]);

    if (!input) {
      this.view.say('Lead update cancelled.');

      return;
    }

    const { id, ...updates } = input;

    console.log('Updates received:', updates);

    const filteredUpdates = Object.fromEntries(
      Object.entries(updates)
        .filter(([_, value]) => truthy(value)),
    );

    console.log('Filtered updates:', filteredUpdates);

    const lead = await this.repository.update(id, filteredUpdates);

    this.view.say(`Lead ${lead.id} updated successfully`);
    this.view.showLead(lead);
  }

  private createRandom = async (): Promise<void> => {
    const input = await this.ask({
      name: 'count',
      type: 'number',
      message: 'How many random leads to create?',
      min: 1,
      max: 250000,
      validate: mandatory('Count is required'),
    });

    if (!input) {
      this.view.say('Operation cancelled.');

      return;
    }

    const { count } = input;

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
    const input = await this.ask({
      name: 'id',
      type: 'number',
      message: 'Enter lead ID to delete:',
      min: 1,
      validate: mandatory('Lead ID is required'),
    });

    if (!input) {
      this.view.say('Lead deletion cancelled.');

      return;
    }

    const { id } = input;

    const lead = await this.repository.delete(id);

    this.view.say(`Lead ${lead.id} deleted successfully`);
    this.view.showLead(lead);
  }
}
