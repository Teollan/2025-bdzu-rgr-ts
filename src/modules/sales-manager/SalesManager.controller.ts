import { Controller } from '@/core/controller/Controller';
import { mandatory } from '@/lib/validation';
import { truthy } from '@/lib/functional';
import { SalesManagerRepository } from '@/modules/sales-manager/SalesManager.repository';
import { SalesManagerView } from '@/modules/sales-manager/SalesManager.view';

export class SalesManagerController extends Controller {
  private repository = this.makeRepository(SalesManagerRepository);
  private view = this.makeView(SalesManagerView);

  public async run(): Promise<void> {
    const input = await this.ask({
      name: 'action',
      type: 'select',
      message: 'Managing Sales Managers. What would you like to do?',
      choices: [
        { title: 'List all', value: () => this.list() },
        { title: 'Find by ID', value: () => this.find() },
        { title: 'Find Top Performers by Company', value: () => this.findTopPerformersByCompany() },
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
        this.view.say(`Sales Managers (page ${page}):`);
        this.view.showSalesManagers(items);
      },
      onEmptyPage: () => this.view.say('No sales managers found.'),
    });
  }

  private find = async (): Promise<void> => {
    const input = await this.ask({
      name: 'id',
      type: 'number',
      message: 'Enter sales manager ID:',
      min: 1,
      validate: mandatory('Sales manager ID is required'),
    });

    if (!input) {
      this.view.say('Search cancelled.');

      return;
    }

    const { id } = input;

    const salesManager = await this.repository.findById(id);

    if (!salesManager) {
      this.view.say(`Sales manager with id ${id} not found.`);

      return;
    }

    this.view.showSalesManager(salesManager);
  }

  private findTopPerformersByCompany = async (): Promise<void> => {
    const input = await this.ask([
      {
        name: 'companyId',
        type: 'number',
        message: 'Enter company ID:',
        min: 1,
        validate: mandatory('Company ID is required'),
      },
      {
        name: 'from',
        type: 'date',
        message: 'Enter start date (from):',
      },
      {
        name: 'to',
        type: 'date',
        message: 'Enter end date (to):',
      },
      {
        name: 'targetConversionRate',
        type: 'number',
        message: 'Enter target conversion rate (%):',
        min: 0,
        max: 100,
        initial: 20,
      },
    ]);

    if (!input) {
      this.view.say('Search cancelled.');

      return;
    }

    const { companyId, from, to, targetConversionRate } = input;

    const result = await this.repository.findTopPerformersByCompany({
      companyId,
      timeframe: { from, to },
      targetConversionRate: targetConversionRate / 100,
    });

    if (result.length === 0) {
      this.view.say('No sales managers found matching the criteria.');

      return;
    }

    this.view.say(`Top performing sales managers who reached the target conversion rate of ${targetConversionRate}% for company #${companyId} from [${from.toDateString()}] to [${to.toDateString()}]:`);
    this.view.showSalesManagers(result);
  }

  private create = async (): Promise<void> => {
    const input = await this.ask([
      {
        name: 'companyId',
        type: 'number',
        message: 'Enter company ID:',
        validate: mandatory('Company ID is required'),
      },
      {
        name: 'firstName',
        type: 'text',
        message: 'Enter first name:',
        validate: mandatory('First name is required'),
      },
      {
        name: 'lastName',
        type: 'text',
        message: 'Enter last name:',
        validate: mandatory('Last name is required'),
      },
    ]);

    if (!input) {
      this.view.say('Sales manager creation cancelled.');

      return;
    }

    const salesManager = await this.repository.create(input);

    this.view.say(`Sales manager created with id ${salesManager.id}`);
    this.view.showSalesManager(salesManager);
  }

  private update = async (): Promise<void> => {
    const input = await this.ask([
      {
        name: 'id',
        type: 'number',
        message: 'Enter sales manager ID to update:',
        min: 1,
        validate: mandatory('Sales manager ID is required'),
      },
      {
        name: 'companyId',
        type: 'number',
        message: 'Enter new company ID (leave empty to skip):',
      },
      {
        name: 'firstName',
        type: 'text',
        message: 'Enter new first name (leave empty to skip):',
      },
      {
        name: 'lastName',
        type: 'text',
        message: 'Enter new last name (leave empty to skip):',
      },
    ]);

    if (!input) {
      this.view.say('Sales manager update cancelled.');

      return;
    }

    const { id, ...updates } = input;

    const filteredUpdates = Object.fromEntries(
      Object.entries(updates)
        .filter(([_, value]) => truthy(value)),
    );

    if (Object.keys(filteredUpdates).length === 0) {
      this.view.say('No changes made.');

      return;
    }

    const salesManager = await this.repository.update(id, filteredUpdates);

    this.view.say(`Sales manager ${salesManager.id} updated successfully`);
    this.view.showSalesManager(salesManager);
  }

  private createRandom = async (): Promise<void> => {
    const input = await this.ask({
      name: 'count',
      type: 'number',
      message: 'How many random sales managers to create?',
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
        this.view.say(`Created ${count} sales managers (page ${page}):`);
        this.view.showSalesManagers(items);
      },
    });
  }

  private delete = async (): Promise<void> => {
    const input = await this.ask({
      name: 'id',
      type: 'number',
      message: 'Enter sales manager ID to delete:',
      min: 1,
      validate: mandatory('Sales manager ID is required'),
    });

    if (!input) {
      this.view.say('Sales manager deletion cancelled.');

      return;
    }

    const { id } = input;

    const salesManager = await this.repository.delete(id);

    this.view.say(`Sales manager ${salesManager.id} deleted successfully`);
    this.view.showSalesManager(salesManager);
  }
}
