import { Controller } from '@/core/controller';
import { CompanyRepository } from '@/modules/company/Company.repository';
import { CompanyView } from '@/modules/company/Company.view';

export class CompanyController extends Controller {
  private repository = this.makeRepository(CompanyRepository);
  private view = this.makeView(CompanyView);

  public async run(): Promise<void> {
    const { action } = await this.io.ask({
      name: 'action',
      type: 'select',
      message: 'Managing Companies. What would you like to do?',
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
        this.io.say('No companies found.');

        return;
      }

      this.io.say(`Companies found (page ${page}):`);
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
      message: 'Enter company ID:',
      min: 1,
    });

    if (!id) {
      this.io.say('Cancelled.');

      return;
    }

    const company = await this.repository.findById(id);

    if (!company) {
      this.io.say(`Company with id ${id} not found.`);

      return;
    }

    this.view.one(company);
  }

  private create = async (): Promise<void> => {
    const { name } = await this.io.ask({
      name: 'name',
      type: 'text',
      message: 'Enter company name:',
    });

    if (!name) {
      this.io.say('Company creation cancelled.');

      return;
    }

    const company = await this.repository.create({ name });

    this.io.say(`Company created with id ${company.id}`);
    this.view.one(company);
  }

  private update = async (): Promise<void> => {
    const { id } = await this.io.ask({
      name: 'id',
      type: 'number',
      message: 'Enter company ID to update:',
      min: 1,
    });

    const { name } = await this.io.ask({
      name: 'name',
      type: 'text',
      message: 'Enter new company name (leave empty to skip):',
    });

    if (!name) {
      this.io.say('No changes made.');

      return;
    }

    const company = await this.repository.update(id, { name });

    this.io.say(`Company ${company.id} updated successfully`);
    this.view.one(company);
  }

  private delete = async (): Promise<void> => {
    const { id } = await this.io.ask({
      name: 'id',
      type: 'number',
      message: 'Enter company ID to delete:',
      min: 1,
    });

    if (!id) {
      this.io.say('Deletion cancelled.');

      return;
    }

    const company = await this.repository.delete(id);

    this.io.say(`Company ${company.id} deleted successfully`);
    this.view.one(company);
  }
}
