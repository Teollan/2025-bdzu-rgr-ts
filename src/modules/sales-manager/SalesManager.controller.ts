import { Controller } from '@/core/controller';
import { SalesManagerRepository } from '@/modules/sales-manager/SalesManager.repository';
import { SalesManagerView } from '@/modules/sales-manager/SalesManager.view';

export class SalesManagerController extends Controller {
  private repository = this.makeRepository(SalesManagerRepository);
  private view = this.makeView(SalesManagerView);

  public async run(): Promise<void> {
    const { action } = await this.io.ask({
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
    let result = await this.repository.list();

    while (true) {
      const { items, limit, offset, next, prev } = result;
      const page = Math.floor(offset / limit) + 1;

      if (items.length === 0) {
        this.io.say('No sales managers found.');

        return;
      }

      this.io.say(`Sales managers found (page ${page}):`);
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
      message: 'Enter sales manager ID:',
      min: 1,
    });

    if (!id) {
      this.io.say('Cancelled.');

      return;
    }

    const salesManager = await this.repository.findById(id);

    if (!salesManager) {
      this.io.say(`Sales manager with id ${id} not found.`);

      return;
    }

    this.view.one(salesManager);
  }

  findTopPerformersByCompany = async (): Promise<void> => {
    const { companyId } = await this.io.ask({
      name: 'companyId',
      type: 'number',
      message: 'Enter company ID:',
      min: 1,
      validate: (value: number) => Boolean(value) || 'Company ID is required',
    });

    const { from } = await this.io.ask({
      name: 'from',
      type: 'date',
      message: 'Enter start date (from):',
    });

    const { to } = await this.io.ask({
      name: 'to',
      type: 'date',
      message: 'Enter end date (to):',
    });

    const { targetConversionRate } = await this.io.ask({
      name: 'targetConversionRate',
      type: 'number',
      message: 'Enter target conversion rate (%):',
      min: 0,
      max: 100,
      initial: 20,
    });

    const result = await this.repository.findTopPerformersByCompany({
      companyId,
      timeframe: { from, to },
      targetConversionRate: targetConversionRate / 100,
    });

    if (result.length === 0) {
      this.io.say('No sales managers found matching the criteria.');

      return;
    }

    this.io.say(`Top performing sales managers who reached the target conversion rate of ${targetConversionRate} for company #${companyId} from [${from.toDateString()}] to [${to.toDateString()}]:`);
    this.view.many(result);
  }

  private create = async (): Promise<void> => {
    const { companyId } = await this.io.ask({
      name: 'companyId',
      type: 'number',
      message: 'Enter company ID:',
    });

    if (!companyId) {
      this.io.say('Sales manager creation cancelled.');

      return;
    }

    const { firstName } = await this.io.ask({
      name: 'firstName',
      type: 'text',
      message: 'Enter first name:',
    });

    if (!firstName) {
      this.io.say('Sales manager creation cancelled.');

      return;
    }

    const { lastName } = await this.io.ask({
      name: 'lastName',
      type: 'text',
      message: 'Enter last name:',
    });

    if (!lastName) {
      this.io.say('Sales manager creation cancelled.');

      return;
    }

    const salesManager = await this.repository.create({
      companyId,
      firstName,
      lastName,
    });

    this.io.say(`Sales manager created with id ${salesManager.id}`);
    this.view.one(salesManager);
  }

  private update = async (): Promise<void> => {
    const { id } = await this.io.ask({
      name: 'id',
      type: 'number',
      message: 'Enter sales manager ID to update:',
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

    const { firstName } = await this.io.ask({
      name: 'firstName',
      type: 'text',
      message: 'Enter new first name (leave empty to skip):',
    });

    const { lastName } = await this.io.ask({
      name: 'lastName',
      type: 'text',
      message: 'Enter new last name (leave empty to skip):',
    });

    const updates: Record<string, string | number> = {};

    if (companyId) updates.companyId = companyId;
    if (firstName) updates.firstName = firstName;
    if (lastName) updates.lastName = lastName;

    if (Object.keys(updates).length === 0) {
      this.io.say('No changes made.');

      return;
    }

    const salesManager = await this.repository.update(id, updates);

    this.io.say(`Sales manager ${salesManager.id} updated successfully`);
    this.view.one(salesManager);
  }

  private createRandom = async (): Promise<void> => {
    const { count } = await this.io.ask({
      name: 'count',
      type: 'number',
      message: 'How many random sales managers to create?',
      min: 1,
      max: 250000,
    });

    if (!count) {
      this.io.say('Cancelled.');

      return;
    }

    let result = await this.repository.createRandom(count);

    while (true) {
      const { items, limit, offset, next, prev } = result;
      const page = Math.floor(offset / limit) + 1;

      this.io.say(`Created ${count} sales managers (page ${page}):`);
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

  private delete = async (): Promise<void> => {
    const { id } = await this.io.ask({
      name: 'id',
      type: 'number',
      message: 'Enter sales manager ID to delete:',
      min: 1,
    });

    if (!id) {
      this.io.say('Deletion cancelled.');

      return;
    }

    const salesManager = await this.repository.delete(id);

    this.io.say(`Sales manager ${salesManager.id} deleted successfully`);
    this.view.one(salesManager);
  }
}
