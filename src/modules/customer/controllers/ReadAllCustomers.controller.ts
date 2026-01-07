import { ActionController } from '@/core/controller/ActionController';
import { CustomerRepository } from "@/modules/customer/model";
import { CustomerView } from '@/modules/customer/view/Customer.view';

export class ReadAllCustomersController extends ActionController {
  private customerRepository = this.makeRepository(CustomerRepository);
  private customerView = this.makeView(CustomerView);

  async run(): Promise<void> {
    const customers = await this.customerRepository.list();

    if (customers.length === 0) {
      this.io.say("No customers found.");

      return;
    }

    this.io.say("Customers found:");
    this.customerView.many(customers);
  }
}
