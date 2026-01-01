import { Table } from "@/modules/UI/view/Table";
import { SalesManager } from "@/modules/sales-manager/model";

export function showSalesManagers(salesManagers: SalesManager[]): void {
  const table = new Table<SalesManager>({
    id: (s) => s.id,
    company_id: (s) => s.companyId,
    first_name: (s) => s.firstName,
    last_name: (s) => s.lastName,
  });

  console.log(table.build(salesManagers));
}
