import { drawTable } from "@/modules/UI/view/drawTable";
import { SalesManager } from "@/modules/sales-manager/model";

export function showSalesManagers(salesManagers: SalesManager[]): void {
  drawTable(salesManagers, [
    ["id", (s) => s.id],
    ["company_id", (s) => s.companyId],
    ["first_name", (s) => s.firstName],
    ["last_name", (s) => s.lastName],
  ]);
}
