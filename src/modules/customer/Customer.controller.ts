import { Controller } from '@/core/controller/Controller';
import { composeValidators, isEmail, isMandatory, isPhoneNumber } from '@/lib/validation';
import { isEmpty, takeTruthy } from '@/lib/object';
import { CustomerModel } from '@/modules/customer/Customer.model';
import { CustomerView } from '@/modules/customer/Customer.view';

export class CustomerController extends Controller {
  private model = this.makeModel(CustomerModel);
  private view = this.makeView(CustomerView);

  public async run(): Promise<void> {
    const input = await this.ask({
      name: 'action',
      type: 'select',
      message: 'Managing Customers. What would you like to do?',
      choices: [
        { title: 'List all', value: () => this.list() },
        { title: 'Find by ID', value: () => this.find() },
        { title: 'Find Customers Contacted by Sales Manager', value: () => this.findCustomersContactedBySalesManager() },
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
          this.view.say(`Customers found (page ${page}):`);
          this.view.showCustomers(items);
        },
        onEmptyPage: () => this.view.say('No customers found.'),
      });
    } catch {
      this.view.say(`[ERROR]: Failed to list customers`);
    }
  };

  private find = async (): Promise<void> => {
    const input = await this.ask({
      name: 'id',
      type: 'number',
      message: 'Enter customer ID:',
      min: 1,
      validate: isMandatory('Customer ID is required'),
    });

    if (!input) {
      this.view.say('Search cancelled.');

      return;
    }

    const { id } = input;

    try {
      const customer = await this.model.findById(id);

      if (!customer) {
        this.view.say(`Customer with id ${id} not found.`);

        return;
      }

      this.view.showCustomer(customer);
    } catch {
      this.view.say(`[ERROR]: Failed to find customer`);
    }
  };

  private findCustomersContactedBySalesManager = async (): Promise<void> => {
    const input = await this.ask([
      {
        name: 'salesManagerNameLike',
        type: 'text',
        message: 'Enter sales manager name (or part of it):',
        validate: isMandatory('Sales manager name is required'),
      },
      {
        name: 'from',
        type: 'date',
        message: 'Enter start date (YYYY-MM-DD):',
        initial: new Date(new Date().setMonth(new Date().getMonth() - 1)),
      },
      {
        name: 'to',
        type: 'date',
        message: 'Enter end date (YYYY-MM-DD):',
        initial: new Date(),
      }
    ]);

    if (!input) {
      this.view.say('Search cancelled.');

      return;
    }

    const { salesManagerNameLike, from, to } = input;

    try {
      const result = await this.model.findCustomersContactedBySalesManager({
        salesManagerNameLike,
        timeframe: { from, to },
      });

      await this.browsePages({
        data: result,
        onPage: (items, page, { elapsed }) => {
          this.view.say(`Customers contacted by sales managers matching "${salesManagerNameLike}" (page ${page}):`);
          this.view.showCustomers(items);
          this.view.say(`This page was retrieved in ${elapsed} ms.`);
        },
        onEmptyPage: () => this.view.say('No customers found for the given criteria.'),
      });
    } catch {
      this.view.say(`[ERROR]: Failed to find customers contacted by sales manager`);
    }
  };

  private create = async (): Promise<void> => {
    const input = await this.ask([
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
      {
        name: 'phoneNumber',
        type: 'text',
        message: 'Enter phone number:',
        validate: composeValidators(
          isMandatory('Phone number is required'),
          isPhoneNumber('Must be a valid phone number'),
        ),
      },
      {
        name: 'email',
        type: 'text',
        message: 'Enter email:',
        validate: composeValidators(
          isMandatory('Email is required'),
          isEmail('Must be a valid email address'),
        ),
      },
    ]);

    if (!input) {
      this.view.say('Customer creation cancelled.');

      return;
    }

    try {
      const customer = await this.model.create(input);

      this.view.say(`Customer created with id ${customer.id}`);
      this.view.showCustomer(customer);
    } catch {
      this.view.say(`[ERROR]: Failed to create customer`);
    }
  };

  private update = async (): Promise<void> => {
    const input = await this.ask([
      {
        name: 'id',
        type: 'number',
        message: 'Enter customer ID to update:',
        min: 1,
        validate: isMandatory('Customer ID is required'),
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
      {
        name: 'phoneNumber',
        type: 'text',
        message: 'Enter new phone number (leave empty to skip):',
        validate: isPhoneNumber('Must be a valid phone number'),
      },
      {
        name: 'email',
        type: 'text',
        message: 'Enter new email (leave empty to skip):',
        validate: isEmail('Must be a valid email address'),
      },
    ]);

    if (!input) {
      this.view.say('Customer update cancelled.');

      return;
    }

    const { id, ...updates } = input;

    const truthyUpdates = takeTruthy(updates);

    if (isEmpty(truthyUpdates)) {
      this.view.say('No changes. Customer update cancelled.');

      return;
    }

    try {
      const customer = await this.model.update(id, truthyUpdates);

      this.view.say(`Customer ${customer.id} updated successfully`);
      this.view.showCustomer(customer);
    } catch {
      this.view.say(`[ERROR]: Failed to update customer`);
    }
  };

  private createRandom = async (): Promise<void> => {
    const input = await this.ask({
      name: 'count',
      type: 'number',
      message: 'How many random customers to create?',
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
          this.view.say(`Created ${count} customers (page ${page}):`);
          this.view.showCustomers(items);
        },
      });
    } catch {
      this.view.say(`[ERROR]: Failed to create random customers`);
    }
  };

  private delete = async (): Promise<void> => {
    const input = await this.ask({
      name: 'id',
      type: 'number',
      message: 'Enter customer ID to delete:',
      min: 1,
      validate: isMandatory('Customer ID is required'),
    });

    if (!input) {
      this.view.say('Customer deletion cancelled.');

      return;
    }

    const { id } = input;

    this.view.say(`You are about to delete a Customer with ID = ${id}.`);
    this.view.say('Deleting a Customer will also delete all related Leads.');
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
      this.view.say('Customer deletion cancelled.');

      return;
    }

    try {
      const customer = await this.model.delete(id);

      this.view.say(`Customer ${customer.id} deleted successfully`);
      this.view.showCustomer(customer);
    } catch {
      this.view.say(`[ERROR]: Failed to delete customer`);
    }
  };
}
