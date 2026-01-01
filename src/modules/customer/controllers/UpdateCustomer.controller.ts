import { Controller } from "@/core/controller";
import { CustomerRepository } from "@/modules/customer/model";

export interface UpdateCustomerArgs {
  id: number;
  firstName?: string;
  lastName?: string;
  phoneNumber?: string;
  email?: string;
}

type Args = UpdateCustomerArgs;

export class UpdateCustomerController extends Controller<Args> {
  private repository = new CustomerRepository();

  async run(args: Args): Promise<void> {
    const customer = await this.repository.updateCustomer(
      args.id,
      args.firstName,
      args.lastName,
      args.phoneNumber,
      args.email
    );

    console.log(`Customer ${customer.id} updated successfully`);
  }
}
