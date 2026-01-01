import { Table } from "@/modules/UI/view/Table";
import { Customer } from "@/modules/customer/model";

export function showCustomers(customers: Customer[]): void {
  const table = new Table<Customer>({
    id: (c) => c.id,
    first_name: (c) => c.firstName,
    last_name: (c) => c.lastName,
    phone_number: (c) => c.phoneNumber,
    email: (c) => c.email,
  });

  console.log(table.build(customers));
}
