import { drawTable } from "@/modules/UI/view/drawTable";
import { SalesManager } from "@/modules/sales-manager/model";

export function showSalesManager(salesManager: SalesManager): void {
  const entries = Object.entries(salesManager);

  drawTable(entries, [
    ["key", ([k]) => k],
    ["value", ([, v]) => v],
  ]);
}
