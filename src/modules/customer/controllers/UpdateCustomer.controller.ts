import { ActionController } from '@/core/controller/ActionController';
import { CustomerRepository } from "@/modules/customer/model";
import { CustomerView } from '@/modules/customer/view/Customer.view';

export class UpdateCustomerController extends ActionController {
  private customerRepository = this.makeRepository(CustomerRepository);
  private customerView = this.makeView(CustomerView);

  async run(): Promise<void> {
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

    const customer = await this.customerRepository.update(id, updates);

    this.io.say(`Customer ${customer.id} updated successfully`);
    this.customerView.one(customer);
  }
}
