import { Controller } from "@/core/controller";
import { CustomerRepository } from "@/modules/customer/model";
import { showCustomer } from "@/modules/customer/view";

export interface ReadOneCustomerArgs {
  id: number;
}

type Args = ReadOneCustomerArgs;

export class ReadOneCustomerController extends Controller<Args> {
  private repository = new CustomerRepository();

  async run({ id }: Args): Promise<void> {
    const customer = await this.repository.findCustomerById(id);

    if (!customer) {
      console.log(`Customer with id ${id} not found.`);

      return;
    }

    showCustomer(customer);
  }
}
