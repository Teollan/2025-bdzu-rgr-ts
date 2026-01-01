import { PaginationParams, Repository } from "@/core/repository";
import { CreateLeadFields, Lead, UpdateLeadFields } from "@/modules/lead/model/Lead.entity.ts";

export class LeadRepository extends Repository {
  private lead = `
    id,
    company_id AS "companyId",
    customer_id AS "customerId",
    status,
    created_at AS "createdAt"
  `;

  async findLeadById(id: number): Promise<Lead | null> {
    const result = await this.db.query<Lead>`
      SELECT ${this.lead}
      FROM leads
      WHERE id = ${id};
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
    const result = await this.db.query<Lead>`
      SELECT ${this.lead}
      FROM leads
      LIMIT ${limit}
      OFFSET ${offset};
    `;

    return result;
  }

  async createLead({
    companyId,
    customerId,
    status
  }: CreateLeadFields): Promise<Lead> {
    const result = await this.db.query<Lead>`
      INSERT INTO leads (company_id, customer_id, status, created_at)
      VALUES (${companyId}, ${customerId}, ${status}, NOW())
      RETURNING ${this.lead};
    `;

    return result[0];
  }

  async updateLead(
    id: number,
    fields: UpdateLeadFields,
  ): Promise<Lead> {
    const result = await this.db.query<Lead>`
      UPDATE leads
      SET ${this.safeSet('company_id', fields.companyId)},
          ${this.safeSet('customer_id', fields.customerId)},
          ${this.safeSet('status', fields.status)}
      WHERE id = ${id}
      RETURNING ${this.lead};
    `;

    if (result.length === 0) {
      throw new Error(`Lead with id ${id} not found`);
    }

    return result[0];
  }

  async deleteLead(id: number): Promise<Lead> {
    const result = await this.db.query<Lead>`
      DELETE FROM leads
      WHERE id = ${id}
      RETURNING ${this.lead};
    `;

    if (result.length === 0) {
      throw new Error(`Lead with id ${id} not found`);
    }

    return result[0];
  }
}
