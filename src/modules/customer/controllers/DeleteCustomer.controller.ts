import { Controller } from "@/core/controller";
import { CustomerRepository } from "@/modules/customer/model";
import { showCustomer } from '@/modules/customer/view';

export interface DeleteCustomerArgs {
  id: number;
}

type Args = DeleteCustomerArgs;

export class DeleteCustomerController extends Controller<Args> {
  private repository = new CustomerRepository();

  async run(args: Args): Promise<void> {
    const customer = await this.repository.deleteCustomer(args.id);

    console.log(`Customer ${customer.id} deleted successfully`);
    showCustomer(customer);
  }
}
