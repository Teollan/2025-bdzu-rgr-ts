import { ColumnValueTable } from "@/modules/UI/view/Table";
import { SalesManager } from "@/modules/sales-manager/model";

export function showSalesManager(salesManager: SalesManager): void {
  const entries: [string, unknown][] = [
    ["id", salesManager.id],
    ["company_id", salesManager.companyId],
    ["first_name", salesManager.firstName],
    ["last_name", salesManager.lastName],
  ];

  const table = new ColumnValueTable();

  console.log(table.build(entries));
}
