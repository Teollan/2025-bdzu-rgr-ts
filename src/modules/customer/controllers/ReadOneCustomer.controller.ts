import { ActionController } from '@/core/controller/ActionController';
import { CustomerRepository } from "@/modules/customer/model";
import { showCustomer } from "@/modules/customer/view/showCustomer.view";

export class ReadOneCustomerController extends ActionController {
  private repository = this.makeRepository(CustomerRepository);

  async run(): Promise<void> {
    const { id } = await this.app.ask({
      name: 'id',
      type: 'number',
      message: 'Enter customer ID:',
      min: 1,
    });

    if (!id) {
      console.log('Cancelled.');

      return;
    }

    const customer = await this.repository.findCustomerById(id);

    if (!customer) {
      console.log(`Customer with id ${id} not found.`);

      return;
    }

    showCustomer(customer);
  }
}
