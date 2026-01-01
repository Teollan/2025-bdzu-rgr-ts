import { Controller } from "@/core/controller";
import { CustomerRepository } from "@/modules/customer/model";

export interface CreateCustomerArgs {
  firstName: string;
  lastName: string;
  phoneNumber: string;
  email: string;
}

type Args = CreateCustomerArgs;

export class CreateCustomerController extends Controller<Args> {
  private repository = new CustomerRepository();

  async run(args: Args): Promise<void> {
    const customer = await this.repository.createCustomer(
      args.firstName,
      args.lastName,
      args.phoneNumber,
      args.email
    );

    console.log(`Customer created with id ${customer.id}`);
  }
}
