import { ActionController } from '@/core/controller/ActionController';
import { CustomerRepository } from "@/modules/customer/model";
import { CustomerView } from '@/modules/customer/view/Customer.view';

export class DeleteCustomerController extends ActionController {
  private customerRepository = this.makeRepository(CustomerRepository);
  private customerView = this.makeView(CustomerView);

  async run(): Promise<void> {
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

    const customer = await this.customerRepository.delete(id);

    this.io.say(`Customer ${customer.id} deleted successfully`);
    this.customerView.one(customer);
  }
}
