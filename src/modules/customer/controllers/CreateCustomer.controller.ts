import { ActionController } from '@/core/controller/ActionController';
import { CustomerRepository } from "@/modules/customer/model";
import { showCustomer } from '@/modules/customer/view/showCustomer.view';

export class CreateCustomerController extends ActionController {
  private repository = this.makeRepository(CustomerRepository);

  async run(): Promise<void> {
    const { firstName } = await this.app.ask({
      name: 'firstName',
      type: 'text',
      message: 'Enter first name:',
    });

    if (!firstName) {
      console.log('Customer creation cancelled.');

      return;
    }

    const { lastName } = await this.app.ask({
      name: 'lastName',
      type: 'text',
      message: 'Enter last name:',
    });

    if (!lastName) {
      console.log('Customer creation cancelled.');

      return;
    }

    const { phoneNumber } = await this.app.ask({
      name: 'phoneNumber',
      type: 'text',
      message: 'Enter phone number:',
    });

    if (!phoneNumber) {
      console.log('Customer creation cancelled.');

      return;
    }

    const { email } = await this.app.ask({
      name: 'email',
      type: 'text',
      message: 'Enter email:',
    });

    if (!email) {
      console.log('Customer creation cancelled.');

      return;
    }

    const customer = await this.repository.createCustomer({
      firstName,
      lastName,
      phoneNumber,
      email,
    });

    console.log(`Customer created with id ${customer.id}`);
    showCustomer(customer);
  }
}
