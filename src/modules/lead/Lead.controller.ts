import { Controller } from '@/core/controller/Controller';
import { isMandatory } from '@/lib/validation';
import { LeadModel } from '@/modules/lead/Lead.model';
import { LeadStatus } from '@/modules/lead/Lead.entity';
import { LeadView } from '@/modules/lead/Lead.view';
import { isEmpty, takeTruthy } from '@/lib/object';

export class LeadController extends Controller {
  private model = this.makeModel(LeadModel);
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
    try {
      const result = await this.model.list();

      await this.browsePages({
        data: result,
        onPage: (items, page) => {
          this.view.say(`Leads found (page ${page}):`);
          this.view.showLeads(items);
        },
        onEmptyPage: () => this.view.say('No leads found.'),
      });
    } catch {
      this.view.say(`[ERROR]: Failed to list leads`);
    }
  };

  private find = async (): Promise<void> => {
    const input = await this.ask({
      name: 'id',
      type: 'number',
      message: 'Enter lead ID:',
      min: 1,
      validate: isMandatory('Lead ID is required'),
    });

    if (!input) {
      this.view.say('Search cancelled.');

      return;
    }

    const { id } = input;

    try {
      const lead = await this.model.findById(id);

      if (!lead) {
        this.view.say(`Lead with id ${id} not found.`);

        return;
      }

      this.view.showLead(lead);
    } catch {
      this.view.say(`[ERROR]: Failed to find lead`);
    }
  };

  private assignLeads = async (): Promise<void> => {
    try {
      const result = await this.model.assignLeadsToSalesManagers();

      await this.browsePages({
        data: result,
        onPage: (items, page) => {
          this.view.say(`Assigned leads to sales managers (page ${page}):`);
          this.view.showAssignedLeads(items);
        },
        onEmptyPage: () => this.view.say('No unassigned leads found.'),
      });
    } catch {
      this.view.say(`[ERROR]: Failed to assign leads to sales managers`);
    }
  };

  private create = async (): Promise<void> => {
    const input = await this.ask([
      {
        name: 'companyId',
        type: 'number',
        message: 'Enter company ID:',
        min: 1,
        validate: isMandatory('Company ID is required'),
      },
      {
        name: 'customerId',
        type: 'number',
        message: 'Enter customer ID:',
        min: 1,
        validate: isMandatory('Customer ID is required'),
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

    try {
      const lead = await this.model.create(input);

      this.view.say(`Lead created with id ${lead.id}`);
      this.view.showLead(lead);
    } catch {
      this.view.say(`[ERROR]: Failed to create lead`);
    }
  };

  private update = async (): Promise<void> => {
    const input = await this.ask([
      {
        name: 'id',
        type: 'number',
        message: 'Enter lead ID to update:',
        min: 1,
        validate: isMandatory('Lead ID is required'),
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

    const truthyUpdates = takeTruthy(updates);

    if (isEmpty(truthyUpdates)) {
      this.view.say('No changes. Lead update cancelled.');

      return;
    }

    try {
      const lead = await this.model.update(id, truthyUpdates);

      this.view.say(`Lead ${lead.id} updated successfully`);
      this.view.showLead(lead);
    } catch {
      this.view.say(`[ERROR]: Failed to update lead`);
    }
  };

  private createRandom = async (): Promise<void> => {
    const input = await this.ask({
      name: 'count',
      type: 'number',
      message: 'How many random leads to create?',
      min: 1,
      max: 250000,
      validate: isMandatory('Count is required'),
    });

    if (!input) {
      this.view.say('Operation cancelled.');

      return;
    }

    const { count } = input;

    try {
      const result = await this.model.createRandom(count);

      await this.browsePages({
        data: result,
        onPage: (items, page) => {
          this.view.say(`Created ${count} leads (page ${page}):`);
          this.view.showLeads(items);
        },
      });
    } catch {
      this.view.say(`[ERROR]: Failed to create random leads`);
    }
  };

  private delete = async (): Promise<void> => {
    const input = await this.ask({
      name: 'id',
      type: 'number',
      message: 'Enter lead ID to delete:',
      min: 1,
      validate: isMandatory('Lead ID is required'),
    });

    if (!input) {
      this.view.say('Lead deletion cancelled.');

      return;
    }

    const { id } = input;

    this.view.say(`You are about to delete a Lead with ID = ${id}.`);
    this.view.say('Deleting a Lead will also delete all related Sales Manager assignments.');
    this.view.say('This action cannot be undone!');

    const confirmation = await this.ask({
      name: 'confirm',
      type: 'toggle',
      message: 'Are you sure you want to proceed?',
      initial: false,
      active: 'yes',
      inactive: 'no',
    });

    if (!confirmation || !confirmation.confirm) {
      this.view.say('Lead deletion cancelled.');

      return;
    }

    try {
      const lead = await this.model.delete(id);

      this.view.say(`Lead ${lead.id} deleted successfully`);
      this.view.showLead(lead);
    } catch {
      this.view.say(`[ERROR]: Failed to delete lead`);
    }
  };
}
