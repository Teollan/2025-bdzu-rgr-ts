import { ColumnValueTable } from "@/modules/UI/view/Table";
import { Customer } from "@/modules/customer/model";

export function showCustomer(customer: Customer): void {
  const entries: [string, unknown][] = [
    ["id", customer.id],
    ["first_name", customer.firstName],
    ["last_name", customer.lastName],
    ["phone_number", customer.phoneNumber],
    ["email", customer.email],
  ];

  const table = new ColumnValueTable();

  console.log(table.build(entries));
}
