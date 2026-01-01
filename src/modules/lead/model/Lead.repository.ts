import { Repository } from "@/core/repository";
import { Lead } from "@/modules/lead/model/Lead.entity.ts";

export class LeadRepository extends Repository {
  private toEntity(row: Record<string, unknown>): Lead {
    return {
      id: row.id as number,
      companyId: row.company_id as number,
      customerId: row.customer_id as number,
      status: row.status as string,
      createdAt: row.created_at as Date,
    };
  }

  async findLeadById(id: number): Promise<Lead | null> {
    const result = await this.db`
      SELECT *
      FROM leads
      WHERE id = ${id};
    `;

    if (result.length === 0) {
      return null;
    }

    return this.toEntity(result[0]);
  }

  async getAllLeads(limit: number = 20, offset: number = 0): Promise<Lead[]> {
    const result = await this.db`
      SELECT *
      FROM leads
      LIMIT ${limit}
      OFFSET ${offset};
    `;

    return result.map((row) => this.toEntity(row));
  }

  async createLead(companyId: number, customerId: number, status: string): Promise<Lead> {
    const result = await this.db`
      INSERT INTO leads (company_id, customer_id, status, created_at)
      VALUES (${companyId}, ${customerId}, ${status}, NOW())
      RETURNING *;
    `;

    return this.toEntity(result[0]);
  }

  async updateLead(
    id: number,
    companyId?: number,
    customerId?: number,
    status?: string
  ): Promise<Lead> {
    const result = await this.db`
      UPDATE leads
      SET company_id = COALESCE(${companyId ?? null}, company_id),
          customer_id = COALESCE(${customerId ?? null}, customer_id),
          status = COALESCE(${status ?? null}, status)
      WHERE id = ${id}
      RETURNING *;
    `;

    if (result.length === 0) {
      throw new Error(`Lead with id ${id} not found`);
    }

    return this.toEntity(result[0]);
  }

  async deleteLead(id: number): Promise<Lead> {
    const result = await this.db`
      DELETE FROM leads
      WHERE id = ${id}
      RETURNING *;
    `;

    if (result.length === 0) {
      throw new Error(`Lead with id ${id} not found`);
    }

    return this.toEntity(result[0]);
  }
}
