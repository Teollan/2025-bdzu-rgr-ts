import { PaginationParams, Repository } from "@/core/repository";
import { CreateLeadFields, Lead, UpdateLeadFields } from "@/modules/lead/model/Lead.entity.ts";

export class LeadRepository extends Repository {
  async findLeadById(id: number): Promise<Lead | null> {
    const result = await this.sql<Lead[]>`
      SELECT *
      FROM leads
      WHERE id = ${id}
    `;

    if (result.length === 0) {
      return null;
    }

    return result[0];
  }

  async getAllLeads({
    limit = 20,
    offset = 0,
  }: PaginationParams): Promise<Lead[]> {
    return this.sql<Lead[]>`
      SELECT *
      FROM leads
      LIMIT ${limit}
      OFFSET ${offset}
    `;
  }

  async createLead({
    companyId,
    customerId,
    status
  }: CreateLeadFields): Promise<Lead> {
    const result = await this.sql<Lead[]>`
      INSERT INTO leads (company_id, customer_id, status, created_at)
      VALUES (${companyId}, ${customerId}, ${status}, NOW())
      RETURNING *
    `;

    return result[0];
  }

  async updateLead(
    id: number,
    fields: UpdateLeadFields,
  ): Promise<Lead> {
    const result = await this.sql<Lead[]>`
      UPDATE leads
      SET ${this.updates(fields)}
      WHERE id = ${id}
      RETURNING *
    `;

    if (result.length === 0) {
      throw new Error(`Lead with id ${id} not found`);
    }

    return result[0];
  }

  async deleteLead(id: number): Promise<Lead> {
    const result = await this.sql<Lead[]>`
      DELETE
      FROM leads
      WHERE id = ${id}
      RETURNING *
    `;

    if (result.length === 0) {
      throw new Error(`Lead with id ${id} not found`);
    }

    return result[0];
  }
}
