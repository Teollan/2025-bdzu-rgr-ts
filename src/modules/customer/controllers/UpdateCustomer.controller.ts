import { ActionController } from '@/core/controller/ActionController';
import { CustomerRepository } from "@/modules/customer/model";
import { showCustomer } from '@/modules/customer/view/showCustomer.view';

export class UpdateCustomerController extends ActionController {
  private repository = this.makeRepository(CustomerRepository);

  async run(): Promise<void> {
    const { id } = await this.app.ask({
      name: 'id',
      type: 'number',
      message: 'Enter customer ID to update:',
      min: 1,
    });

    if (!id) {
      console.log('Update cancelled.');

      return;
    }

    const { firstName } = await this.app.ask({
      name: 'firstName',
      type: 'text',
      message: 'Enter new first name (leave empty to skip):',
    });

    const { lastName } = await this.app.ask({
      name: 'lastName',
      type: 'text',
      message: 'Enter new last name (leave empty to skip):',
    });

    const { phoneNumber } = await this.app.ask({
      name: 'phoneNumber',
      type: 'text',
      message: 'Enter new phone number (leave empty to skip):',
    });

    const { email } = await this.app.ask({
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
      console.log('No changes made.');

      return;
    }

    const customer = await this.repository.updateCustomer(id, updates);

    console.log(`Customer ${customer.id} updated successfully`);
    showCustomer(customer);
  }
}
