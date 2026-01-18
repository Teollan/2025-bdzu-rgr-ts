import { Controller } from '@/core/controller/Controller';
import { isEmpty, takeTruthy } from '@/lib/object';
import { isMandatory } from '@/lib/validation';
import { CompanyRepository } from '@/modules/company/Company.repository';
import { CompanyView } from '@/modules/company/Company.view';

export class CompanyController extends Controller {
  private repository = this.makeRepository(CompanyRepository);
  private view = this.makeView(CompanyView);

  public async run(): Promise<void> {
    const input = await this.ask({
      name: 'action',
      type: 'select',
      message: 'Managing Companies. What would you like to do?',
      choices: [
        { title: 'List all', value: () => this.list() },
        { title: 'Find by ID', value: () => this.find() },
        { title: 'Find Companies with Large Customer Bases', value: () => this.findCompaniesWithLargeCustomerBases() },
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
      const result = await this.repository.list();

      await this.browsePages({
        data: result,
        onPage: (items, page) => {
          this.view.say(`Companies found (page ${page}):`);
          this.view.showCompanies(items);
        },
        onEmptyPage: () => this.view.say('No companies found.'),
      });
    } catch {
      this.view.say(`[ERROR]: Failed to list companies`);
    }
  };

  private find = async (): Promise<void> => {
    const input = await this.ask({
      name: 'id',
      type: 'number',
      message: 'Enter company ID:',
      min: 1,
      validate: isMandatory('Company ID is required'),
    });

    if (!input) {
      this.view.say('Search cancelled.');

      return;
    }

    const { id } = input;

    try {
      const company = await this.repository.findById(id);

      if (!company) {
        this.view.say(`Company with id ${id} not found.`);

        return;
      }

      this.view.showCompany(company);
    } catch {
      this.view.say(`[ERROR]: Failed to find company`);
    }
  };

  private findCompaniesWithLargeCustomerBases = async (): Promise<void> => {
    const input = await this.ask({
      name: 'minClients',
      type: 'number',
      message: 'Enter minimum number of customers:',
      initial: 20,
      min: 1,
    });

    if (!input) {
      this.view.say('Search cancelled.');

      return;
    }

    const { minClients } = input;

    try {
      const result = await this.repository.findCompaniesWithLargeCustomerBases(minClients);

      await this.browsePages({
        data: result,
        onPage: (items, page, { elapsed }) => {
          this.view.say(`Companies with at least ${minClients} customers (page ${page}):`);
          this.view.showCompaniesWithCustomerCount(items);
          this.view.say(`This page was retrieved in ${elapsed} ms.`);
        },
        onEmptyPage: () => this.view.say(`No companies with more than the ${minClients} of customers found.`),
      });
    } catch {
      this.view.say(`[ERROR]: Failed to find companies with large customer bases`);
    }
  };

  private create = async (): Promise<void> => {
    const input = await this.ask({
      name: 'name',
      type: 'text',
      message: 'Enter company name:',
      validate: isMandatory('Company name is required'),
    });

    if (!input) {
      this.view.say('Company creation cancelled.');

      return;
    }

    try {
      const company = await this.repository.create(input);

      this.view.say(`Company created with id ${company.id}`);
      this.view.showCompany(company);
    } catch {
      this.view.say(`[ERROR]: Failed to create company`);
    }
  };

  private update = async (): Promise<void> => {
    const input = await this.ask([
      {
        name: 'id',
        type: 'number',
        message: 'Enter company ID to update:',
        min: 1,
        validate: isMandatory('Company ID is required'),
      },
      {
        name: 'name',
        type: 'text',
        message: 'Enter new company name (leave empty to skip):',
      },
    ]);

    if (!input) {
      this.view.say('Company update cancelled.');

      return;
    }

    const { id, ...updates } = input;

    const truthyUpdates = takeTruthy(updates);

    if (isEmpty(truthyUpdates)) {
      this.view.say('No changes. Company update cancelled.');

      return;
    }

    try {
      const company = await this.repository.update(id, truthyUpdates);

      this.view.say(`Company ${company.id} updated successfully`);
      this.view.showCompany(company);
    } catch {
      this.view.say(`[ERROR]: Failed to update company`);
    }
  };

  private createRandom = async (): Promise<void> => {
    const input = await this.ask({
      name: 'count',
      type: 'number',
      message: 'How many random companies to create?',
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
      const result = await this.repository.createRandom(count);

      await this.browsePages({
        data: result,
        onPage: (items, page) => {
          this.view.say(`Created ${count} companies (page ${page}):`);
          this.view.showCompanies(items);
        },
      });
    } catch {
      this.view.say(`[ERROR]: Failed to create random companies`);
    }
  };

  private delete = async (): Promise<void> => {
    const input = await this.ask({
      name: 'id',
      type: 'number',
      message: 'Enter company ID to delete:',
      min: 1,
      validate: isMandatory('Company ID is required'),
    });

    if (!input) {
      this.view.say('Company deletion cancelled.');

      return;
    }

    const { id } = input;

    try {
      const company = await this.repository.delete(id);

      this.view.say(`Company ${company.id} deleted successfully`);
      this.view.showCompany(company);
    } catch {
      this.view.say(`[ERROR]: Failed to delete company`);
    }
  };
}
