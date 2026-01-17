import { Repository } from "@/core/repository/Repository";
import { paginate, pseudoPaginate, Paginated } from "@/lib/pagination";
import { MONTH } from '@/lib/time';
import { CreateLeadFields, Lead, LeadCompanySalesManager, UpdateLeadFields } from "@/modules/lead/Lead.entity";

interface LeadCreateManyOptions {
  createdAt?: { from?: Date; to?: Date };
}
export class LeadRepository extends Repository {
  async findById(id: number): Promise<Lead | null> {
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

  async assignLeadsToSalesManagers(): Promise<Paginated<LeadCompanySalesManager>> {
    return pseudoPaginate(() => this.sql<LeadCompanySalesManager[]>`
      WITH created_sales_manager_leads AS (
        WITH unassigned_leads AS (
          SELECT
            l.id,
            l.company_id
          FROM leads l
          LEFT JOIN sales_manager_leads sml ON l.id = sml.lead_id
          WHERE sml.sales_manager_id IS NULL
          ORDER BY l.created_at ASC
        ),
        random_assignments AS (
          SELECT
            ul.id AS lead_id,
            (
              SELECT sm.id
              FROM sales_managers sm
              WHERE sm.company_id = ul.company_id
              ORDER BY random()
              LIMIT 1
            ) AS sales_manager_id
          FROM unassigned_leads ul
        )
        INSERT INTO sales_manager_leads (sales_manager_id, lead_id)
        SELECT sales_manager_id, lead_id
        FROM random_assignments
        WHERE sales_manager_id IS NOT NULL
        RETURNING *
      )
      SELECT
        l.id AS lead_id,
        concat(sm.first_name, ' ', sm.last_name) AS sales_manager_name,
        c.name AS company_name
      FROM created_sales_manager_leads csml
      JOIN leads l ON l.id = csml.lead_id
      JOIN sales_managers sm ON sm.id = csml.sales_manager_id
      JOIN companies c ON c.id = l.company_id
      ORDER BY c.id, l.id
    `);
  }

  async list(): Promise<Paginated<Lead>> {
    return paginate(({ limit, offset }) => this.sql<Lead[]>`
      SELECT *
      FROM leads
      LIMIT ${limit}
      OFFSET ${offset}
    `);
  }

  async create({
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

  async createRandom(count: number, options: LeadCreateManyOptions = {}): Promise<Paginated<Lead>> {
    const {
      createdAt = {}
    } = options;

    const {
      from = new Date(Date.now() - 3 * MONTH),
      to = new Date()
    } = createdAt;

    return pseudoPaginate(() => this.sql<Lead[]>`
      WITH
        random_company_ids AS (SELECT id AS company_id FROM companies ORDER BY random()),
        random_customer_ids AS (SELECT id AS customer_id FROM customers ORDER BY random())
      INSERT INTO leads (company_id, customer_id, status, created_at)
      SELECT
        (SELECT company_id FROM random_company_ids OFFSET (i % (SELECT count(*) FROM random_company_ids)) LIMIT 1),
        (SELECT customer_id FROM random_customer_ids OFFSET (i % (SELECT count(*) FROM random_customer_ids)) LIMIT 1),
        (statuses[trunc(random() * array_length(statuses, 1)) + 1]) AS status,
        (${from} + (random() * (${to} - ${from}))) AS created_at
      FROM generate_series(1, ${count}) i
      CROSS JOIN (SELECT enum_range(null::lead_status) AS statuses) AS t1
      RETURNING *
    `);
  }

  async update(
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

  async delete(id: number): Promise<Lead> {
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
