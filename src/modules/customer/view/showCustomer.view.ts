import { drawTable } from "@/modules/UI/view/drawTable";
import { Customer } from "@/modules/customer/model";

export function showCustomer(customer: Customer): void {
  const entries = Object.entries(customer);

  drawTable(entries, [
    ["key", ([k]) => k],
    ["value", ([, v]) => v],
  ]);
}
