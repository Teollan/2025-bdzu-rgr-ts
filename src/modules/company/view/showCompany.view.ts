import { ColumnValueTable } from "@/core/output";
import { Company } from "@/modules/company/model";

export function showCompany(company: Company): void {
  const entries: [string, unknown][] = [
    ["id", company.id],
    ["name", company.name],
  ];

  const table = new ColumnValueTable();

  console.log(table.build(entries));
}
