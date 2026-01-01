import { Controller } from "@/core/controller";
import { CustomerRepository } from "@/modules/customer/model";
import { showCustomers } from "@/modules/customer/view";

export interface ReadAllCustomersArgs {
  limit: number;
  offset: number;
}

type Args = ReadAllCustomersArgs;

export class ReadAllCustomersController extends Controller<Args> {
  private repository = new CustomerRepository();

  async run(args: Args): Promise<void> {
    const customers = await this.repository.getAllCustomers(args);

    if (customers.length === 0) {
      console.log("No customers found.");

      return;
    }

    console.log("Customers found:");
    showCustomers(customers);
  }
}
