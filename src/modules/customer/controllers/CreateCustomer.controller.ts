import { ActionController } from '@/core/controller/ActionController';
import { CustomerRepository } from "@/modules/customer/model";
import { CustomerView } from '@/modules/customer/view/Customer.view';

export class CreateCustomerController extends ActionController {
  private customerRepository = this.makeRepository(CustomerRepository);
  private customerView = this.makeView(CustomerView);

  async run(): Promise<void> {
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

    const customer = await this.customerRepository.create({
      firstName,
      lastName,
      phoneNumber,
      email,
    });

    this.io.say(`Customer created with id ${customer.id}`);
    this.customerView.one(customer);
  }
}
