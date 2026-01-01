import { ColumnValueTable } from "@/core/output";
import { Lead } from "@/modules/lead/model";

export function showLead(lead: Lead): void {
  const entries: [string, unknown][] = [
    ["id", lead.id],
    ["company_id", lead.companyId],
    ["customer_id", lead.customerId],
    ["status", lead.status],
    ["created_at", lead.createdAt.toISOString()],
  ];

  const table = new ColumnValueTable();

  console.log(table.build(entries));
}
