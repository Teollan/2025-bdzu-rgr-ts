import { drawTable } from "@/modules/UI/view/drawTable";
import { Lead } from "@/modules/lead/model";

export function showLead(lead: Lead): void {
  const entries = Object.entries(lead);

  drawTable(entries, [
    ["key", ([k]) => k],
    ["value", ([, v]) => v],
  ]);
}
