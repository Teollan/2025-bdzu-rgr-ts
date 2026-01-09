import { Controller } from '@/core/controller';
import { CustomerRepository } from '@/modules/customer/Customer.repository';
import { CustomerView } from '@/modules/customer/Customer.view';

export class CustomerController extends Controller {
  private repository = this.makeRepository(CustomerRepository);
  private view = this.makeView(CustomerView);

  public async run(): Promise<void> {
    const { action } = await this.io.ask({
      name: 'action',
      type: 'select',
      message: 'Managing Customers. What would you like to do?',
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
        this.io.say('No customers found.');

        return;
      }

      this.io.say(`Customers found (page ${page}):`);
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
      message: 'Enter customer ID:',
      min: 1,
    });

    if (!id) {
      this.io.say('Cancelled.');

      return;
    }

    const customer = await this.repository.findById(id);

    if (!customer) {
      this.io.say(`Customer with id ${id} not found.`);

      return;
    }

    this.view.one(customer);
  }

  private create = async (): Promise<void> => {
    const { firstName } = await this.io.ask({
      name: 'firstName',
      type: 'text',
      message: 'Enter first name:',
    });

    if (!firstName) {
      this.io.say('Customer creation cancelled.');

      return;
    }

    const { lastName } = await this.io.ask({
      name: 'lastName',
      type: 'text',
      message: 'Enter last name:',
    });

    if (!lastName) {
      this.io.say('Customer creation cancelled.');

      return;
    }

    const { phoneNumber } = await this.io.ask({
      name: 'phoneNumber',
      type: 'text',
      message: 'Enter phone number:',
    });

    if (!phoneNumber) {
      this.io.say('Customer creation cancelled.');

      return;
    }

    const { email } = await this.io.ask({
      name: 'email',
      type: 'text',
      message: 'Enter email:',
    });

    if (!email) {
      this.io.say('Customer creation cancelled.');

      return;
    }

    const customer = await this.repository.create({
      firstName,
      lastName,
      phoneNumber,
      email,
    });

    this.io.say(`Customer created with id ${customer.id}`);
    this.view.one(customer);
  }

  private update = async (): Promise<void> => {
    const { id } = await this.io.ask({
      name: 'id',
      type: 'number',
      message: 'Enter customer ID to update:',
      min: 1,
    });

    if (!id) {
      this.io.say('Update cancelled.');

      return;
    }

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

    const { phoneNumber } = await this.io.ask({
      name: 'phoneNumber',
      type: 'text',
      message: 'Enter new phone number (leave empty to skip):',
    });

    const { email } = await this.io.ask({
      name: 'email',
      type: 'text',
      message: 'Enter new email (leave empty to skip):',
    });

    const updates: Record<string, string> = {};

    if (firstName) updates.firstName = firstName;
    if (lastName) updates.lastName = lastName;
    if (phoneNumber) updates.phoneNumber = phoneNumber;
    if (email) updates.email = email;

    if (Object.keys(updates).length === 0) {
      this.io.say('No changes made.');

      return;
    }

    const customer = await this.repository.update(id, updates);

    this.io.say(`Customer ${customer.id} updated successfully`);
    this.view.one(customer);
  }

  private delete = async (): Promise<void> => {
    const { id } = await this.io.ask({
      name: 'id',
      type: 'number',
      message: 'Enter customer ID to delete:',
      min: 1,
    });

    if (!id) {
      this.io.say('Deletion cancelled.');

      return;
    }

    const customer = await this.repository.delete(id);

    this.io.say(`Customer ${customer.id} deleted successfully`);
    this.view.one(customer);
  }
}
