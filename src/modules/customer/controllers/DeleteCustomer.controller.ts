import { ActionController } from '@/core/controller/ActionController';
import { CustomerRepository } from "@/modules/customer/model";
import { showCustomer } from '@/modules/customer/view/showCustomer.view';

export class DeleteCustomerController extends ActionController {
  private repository = this.makeRepository(CustomerRepository);

  async run(): Promise<void> {
    const { id } = await this.app.ask({
      name: 'id',
      type: 'number',
      message: 'Enter customer ID to delete:',
      min: 1,
    });

    if (!id) {
      console.log('Deletion cancelled.');

      return;
    }

    const customer = await this.repository.deleteCustomer(id);

    console.log(`Customer ${customer.id} deleted successfully`);
    showCustomer(customer);
  }
}
