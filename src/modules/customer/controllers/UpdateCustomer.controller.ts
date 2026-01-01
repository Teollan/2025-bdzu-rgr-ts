import { Controller } from "@/core/controller";
import { CustomerRepository } from "@/modules/customer/model";
import { showCustomer } from '@/modules/customer/view';

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

  async run({id, ...updates}: Args): Promise<void> {
    const customer = await this.repository.updateCustomer(id, updates);

    console.log(`Customer ${customer.id} updated successfully`);
    showCustomer(customer);
  }
}
