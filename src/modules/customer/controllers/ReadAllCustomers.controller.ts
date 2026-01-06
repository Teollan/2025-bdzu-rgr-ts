import { ActionController } from '@/core/controller/ActionController';
import { CustomerRepository } from "@/modules/customer/model";
import { showCustomers } from "@/modules/customer/view/showCustomers.view";

export class ReadAllCustomersController extends ActionController {
  private repository = this.makeRepository(CustomerRepository);

  async run(): Promise<void> {
    const customers = await this.repository.getAllCustomers({});

    if (customers.length === 0) {
      console.log("No customers found.");

      return;
    }

    console.log("Customers found:");
    showCustomers(customers);
  }
}
