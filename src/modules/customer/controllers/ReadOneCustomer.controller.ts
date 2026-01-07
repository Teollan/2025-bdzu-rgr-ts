import { ActionController } from '@/core/controller/ActionController';
import { CustomerRepository } from "@/modules/customer/model";
import { CustomerView } from '@/modules/customer/view/Customer.view';

export class ReadOneCustomerController extends ActionController {
  private customerRepository = this.makeRepository(CustomerRepository);
  private customerView = this.makeView(CustomerView);

  async run(): Promise<void> {
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

    const customer = await this.customerRepository.findById(id);

    if (!customer) {
      this.io.say(`Customer with id ${id} not found.`);

      return;
    }

    this.customerView.one(customer);
  }
}
