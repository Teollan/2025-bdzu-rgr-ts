import { Controller } from '@/core/controller/Controller';
import { isMandatory } from '@/lib/validation';
import { isEmpty, takeTruthy } from '@/lib/object';
import { SalesManagerModel } from '@/modules/sales-manager/SalesManager.model';
import { SalesManagerView } from '@/modules/sales-manager/SalesManager.view';

export class SalesManagerController extends Controller {
  private model = this.makeModel(SalesManagerModel);
  private view = this.makeView(SalesManagerView);

  public async run(): Promise<void> {
    const input = await this.ask({
      name: 'action',
      type: 'select',
      message: 'Managing Sales Managers. What would you like to do?',
      choices: [
        { title: 'List all', value: () => this.list() },
        { title: 'Find by ID', value: () => this.find() },
        { title: 'Find Top Performers by Companies', value: () => this.findTopPerformersByCompanies() },
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
          this.view.say(`Sales Managers (page ${page}):`);
          this.view.showSalesManagers(items);
        },
        onEmptyPage: () => this.view.say('No sales managers found.'),
      });
    } catch {
      this.view.say(`[ERROR]: Failed to list sales managers`);
    }
  };

  private find = async (): Promise<void> => {
    const input = await this.ask({
      name: 'id',
      type: 'number',
      message: 'Enter sales manager ID:',
      min: 1,
      validate: isMandatory('Sales manager ID is required'),
    });

    if (!input) {
      this.view.say('Search cancelled.');

      return;
    }

    const { id } = input;

    try {
      const salesManager = await this.model.findById(id);

      if (!salesManager) {
        this.view.say(`Sales manager with id ${id} not found.`);

        return;
      }

      this.view.showSalesManager(salesManager);
    } catch {
      this.view.say(`[ERROR]: Failed to find sales manager`);
    }
  };

  private findTopPerformersByCompanies = async (): Promise<void> => {
    const input = await this.ask([
      {
        name: 'companyIdRangeFrom',
        type: 'number',
        message: 'Enter company ID range start:',
        min: 1,
        validate: isMandatory('Company ID range start is required'),
      },
      {
        name: 'companyIdRangeTo',
        type: 'number',
        message: 'Enter company ID range end:',
        min: 1,
        validate: isMandatory('Company ID range end is required'),
      },
      {
        name: 'dateRangeFrom',
        type: 'date',
        message: 'Enter start date (from):',
        initial: new Date(new Date().setMonth(new Date().getMonth() - 1)),
        validate: isMandatory('Start date is required'),
      },
      {
        name: 'dateRangeTo',
        type: 'date',
        message: 'Enter end date (to):',
        initial: new Date(),
        validate: isMandatory('End date is required'),
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

    const {
      companyIdRangeFrom,
      companyIdRangeTo,
      dateRangeFrom,
      dateRangeTo,
      targetConversionRate,
    } = input;

    if (companyIdRangeFrom > companyIdRangeTo) {
      this.view.say(`Invalid company ID range: start [${companyIdRangeFrom}] cannot be greater than end [${companyIdRangeTo}].`);

      return;
    }

    if (dateRangeFrom > dateRangeTo) {
      this.view.say(`Invalid date range: start [${dateRangeFrom.toDateString()}] cannot be later than end [${dateRangeTo.toDateString()}].`);

      return;
    }

    try {
      const result = await this.model.findTopPerformersByCompanies({
        companyIdRange: { from: companyIdRangeFrom, to: companyIdRangeTo },
        timeframe: { from: dateRangeFrom, to: dateRangeTo },
        targetConversionRate: targetConversionRate / 100,
      });

      await this.browsePages({
        data: result,
        onPage: (items, page, { elapsed }) => {
          this.view.say(`Top performing sales managers (page ${page}):`);
          this.view.showSalesManagerStats(items);
          this.view.say(`This page was retrieved in ${elapsed} ms.`);
        },
        onEmptyPage: () => this.view.say('No sales managers found matching the criteria.'),
      });
    } catch {
      this.view.say(`[ERROR]: Failed to find top performers`);
    }
  };

  private create = async (): Promise<void> => {
    const input = await this.ask([
      {
        name: 'companyId',
        type: 'number',
        message: 'Enter company ID:',
        validate: isMandatory('Company ID is required'),
      },
      {
        name: 'firstName',
        type: 'text',
        message: 'Enter first name:',
        validate: isMandatory('First name is required'),
      },
      {
        name: 'lastName',
        type: 'text',
        message: 'Enter last name:',
        validate: isMandatory('Last name is required'),
      },
    ]);

    if (!input) {
      this.view.say('Sales manager creation cancelled.');

      return;
    }

    try {
      const salesManager = await this.model.create(input);

      this.view.say(`Sales manager created with id ${salesManager.id}`);
      this.view.showSalesManager(salesManager);
    } catch {
      this.view.say(`[ERROR]: Failed to create sales manager`);
    }
  };

  private update = async (): Promise<void> => {
    const input = await this.ask([
      {
        name: 'id',
        type: 'number',
        message: 'Enter sales manager ID to update:',
        min: 1,
        validate: isMandatory('Sales manager ID is required'),
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

    const truthyUpdates = takeTruthy(updates);

    if (isEmpty(truthyUpdates)) {
      this.view.say('No changes. Sales manager update cancelled.');

      return;
    }

    try {
      const salesManager = await this.model.update(id, truthyUpdates);

      this.view.say(`Sales manager ${salesManager.id} updated successfully`);
      this.view.showSalesManager(salesManager);
    } catch {
      this.view.say(`[ERROR]: Failed to update sales manager`);
    }
  };

  private createRandom = async (): Promise<void> => {
    const input = await this.ask({
      name: 'count',
      type: 'number',
      message: 'How many random sales managers to create?',
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
          this.view.say(`Created ${count} sales managers (page ${page}):`);
          this.view.showSalesManagers(items);
        },
      });
    } catch {
      this.view.say(`[ERROR]: Failed to create random sales managers`);
    }
  };

  private delete = async (): Promise<void> => {
    const input = await this.ask({
      name: 'id',
      type: 'number',
      message: 'Enter sales manager ID to delete:',
      min: 1,
      validate: isMandatory('Sales manager ID is required'),
    });

    if (!input) {
      this.view.say('Sales manager deletion cancelled.');

      return;
    }

    const { id } = input;

    this.view.say(`You are about to delete a Sales Manager with ID = ${id}.`);
    this.view.say('Deleting a Sales Manager will also delete all related Lead assignments.');
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
      this.view.say('Sales manager deletion cancelled.');

      return;
    }

    try {
      const salesManager = await this.model.delete(id);

      this.view.say(`Sales manager ${salesManager.id} deleted successfully`);
      this.view.showSalesManager(salesManager);
    } catch {
      this.view.say(`[ERROR]: Failed to delete sales manager`);
    }
  };
}
