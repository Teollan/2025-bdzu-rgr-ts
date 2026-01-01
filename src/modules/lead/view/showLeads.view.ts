import { Table } from "@/modules/UI/view/Table";
import { Lead } from "@/modules/lead/model";

export function showLeads(leads: Lead[]): void {
  const table = new Table<Lead>({
    id: (l) => l.id,
    company_id: (l) => l.companyId,
    customer_id: (l) => l.customerId,
    status: (l) => l.status,
    created_at: (l) => l.createdAt.toISOString(),
  });

  console.log(table.build(leads));
}
