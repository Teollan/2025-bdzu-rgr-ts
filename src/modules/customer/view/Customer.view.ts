import { View } from '@/core/view/View';
import { Customer } from '@/modules/customer/model';

export class CustomerView extends View {
  one(customer: Customer): void {
    this.io.object(customer);
  }

  many(customers: Customer[]): void {
    this.io.table(customers);
  }
}
