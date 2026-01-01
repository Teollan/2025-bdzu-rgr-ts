import { Table } from "@/core/output";
import { Company } from "@/modules/company/model";

export function showCompanies(companies: Company[]): void {
  const table = new Table<Company>({
    id: (c) => c.id,
    name: (c) => c.name,
  });

  console.log(table.build(companies));
}
