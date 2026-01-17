import { View } from '@/core/view/View';
import { Customer } from '@/modules/customer/Customer.entity';

export class CustomerView extends View {
  showCustomer(customer: Customer): void {
    this.object(customer);
  }

  showCustomers(customers: Customer[]): void {
    this.table(customers, {
      columns: [
        ['ID', 'id'],
        ['First Name', 'firstName'],
        ['Last Name', 'lastName'],
        ['Phone Number', 'phoneNumber'],
        ['Email', 'email'],
      ],
    });
  }
}
