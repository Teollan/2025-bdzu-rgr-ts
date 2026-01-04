import { drawTable } from "@/modules/UI/view/drawTable";
import { Lead } from "@/modules/lead/model";

export function showLeads(leads: Lead[]): void {
  drawTable(leads, [
    ["id", (l) => l.id],
    ["company_id", (l) => l.companyId],
    ["customer_id", (l) => l.customerId],
    ["status", (l) => l.status],
    ["created_at", (l) => l.createdAt],
  ]);
}
