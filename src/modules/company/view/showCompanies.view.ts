import { drawTable } from "@/modules/UI/view/drawTable";
import { Company } from "@/modules/company/model";

export function showCompanies(companies: Company[]): void {
  drawTable(companies, [
    ["id", (c) => `${c.id}`],
    ["name", (c) => c.name],
  ]);
}
