import { Controller } from '@/core/controller/Controller';
import { CompanyRepository } from '@/modules/company/Company.repository';
import { CompanyView } from '@/modules/company/Company.view';

export class CompanyController extends Controller {
  private repository = this.makeRepository(CompanyRepository);
  private view = this.makeView(CompanyView);

  public async run(): Promise<void> {
    const { action } = await this.ask({
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
          title: 'Find Companies with Large Customer Bases',
          value: () => this.findCompaniesWithLargeCustomerBases(),
        },
        {
          title: 'Create',
          value: () => this.create(),
        },
        {
          title: 'Create Random',
          value: () => this.createRandom(),
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
    const result = await this.repository.list();

    await this.browsePages({
      data: result,
      onPage: (items, page) => {
        this.view.say(`Companies found (page ${page}):`);
        this.view.showCompanies(items);
      },
      onEmptyPage: () => this.view.say('No companies found.'),
    });
  }

  private find = async (): Promise<void> => {
    const { id } = await this.ask({
      name: 'id',
      type: 'number',
      message: 'Enter company ID:',
      min: 1,
    });

    if (!id) {
      this.view.say('Cancelled.');

      return;
    }

    const company = await this.repository.findById(id);

    if (!company) {
      this.view.say(`Company with id ${id} not found.`);

      return;
    }

    this.view.showCompany(company);
  }

  private findCompaniesWithLargeCustomerBases = async (): Promise<void> => {
    const { minClients } = await this.ask({
      name: 'minClients',
      type: 'number',
      message: 'Enter minimum number of customers:',
      initial: 20,
      min: 0,
    });

    const result = await this.repository.findCompaniesWithLargeCustomerBases(minClients);

    await this.browsePages({
      data: result,
      onPage: (items, page) => {
        this.view.say(`Companies with at least ${minClients} customers (page ${page}):`);
        this.view.showCompaniesWithCustomerCount(items);
      },
      onEmptyPage: () => this.view.say(`No companies with more than the ${minClients} of customers found.`),
    });
  }

  private create = async (): Promise<void> => {
    const { name } = await this.ask({
      name: 'name',
      type: 'text',
      message: 'Enter company name:',
    });

    if (!name) {
      this.view.say('Company creation cancelled.');

      return;
    }

    const company = await this.repository.create({ name });

    this.view.say(`Company created with id ${company.id}`);
    this.view.showCompany(company);
  }

  private update = async (): Promise<void> => {
    const { id } = await this.ask({
      name: 'id',
      type: 'number',
      message: 'Enter company ID to update:',
      min: 1,
    });

    const { name } = await this.ask({
      name: 'name',
      type: 'text',
      message: 'Enter new company name (leave empty to skip):',
    });

    if (!name) {
      this.view.say('No changes made.');

      return;
    }

    const company = await this.repository.update(id, { name });

    this.view.say(`Company ${company.id} updated successfully`);
    this.view.showCompany(company);
  }

  private createRandom = async (): Promise<void> => {
    const { count } = await this.ask({
      name: 'count',
      type: 'number',
      message: 'How many random companies to create?',
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
        this.view.say(`Created ${count} companies (page ${page}):`);
        this.view.showCompanies(items);
      },
    });
  }

  private delete = async (): Promise<void> => {
    const { id } = await this.ask({
      name: 'id',
      type: 'number',
      message: 'Enter company ID to delete:',
      min: 1,
    });

    if (!id) {
      this.view.say('Deletion cancelled.');

      return;
    }

    const company = await this.repository.delete(id);

    this.view.say(`Company ${company.id} deleted successfully`);
    this.view.showCompany(company);
  }
}
