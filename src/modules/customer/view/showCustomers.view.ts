import { drawTable } from "@/modules/UI/view/drawTable";
import { Customer } from "@/modules/customer/model";

export function showCustomers(customers: Customer[]): void {
  drawTable(customers, [
    ["id", (c) => c.id],
    ["first_name", (c) => c.firstName],
    ["last_name", (c) => c.lastName],
    ["phone_number", (c) => c.phoneNumber],
    ["email", (c) => c.email],
  ]);
}
