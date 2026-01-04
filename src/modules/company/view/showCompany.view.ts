import { drawTable } from "@/modules/UI/view/drawTable";
import { Company } from "@/modules/company/model";

export function showCompany(company: Company): void {
  const entries = Object.entries(company);

  drawTable(entries, [
    ["key", ([k]) => k],
    ["value", ([, v]) => v],
  ]);
}
