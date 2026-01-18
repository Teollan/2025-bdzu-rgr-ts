import { Model } from "@/core/model/Model";
import { paginate, paginateInMemory, Page } from "@/lib/pagination";
import { CreateSalesManagerFields, SalesManager, SalesManagerStats, UpdateSalesManagerFields } from "@/modules/sales-manager/SalesManager.entity";
import { WithExecutionTime, withExecutionTime } from '@/lib/stopwatch';
import { Range } from '@/lib/range';

interface TopPerformersSearchParams {
  companyIdRange: Range<number>;
  timeframe: Range<Date>;
  targetConversionRate: number;
}

export class SalesManagerModel extends Model {
  async findById(id: number): Promise<SalesManager | null> {
    const result = await this.sql<SalesManager[]>`
      SELECT *
      FROM sales_managers
      WHERE id = ${id}
    `;

    if (result.length === 0) {
      return null;
    }

    return result[0];
  }

  async findTopPerformersByCompanies({
    companyIdRange,
    timeframe,
    targetConversionRate,
  }: TopPerformersSearchParams): Promise<Page<SalesManagerStats, WithExecutionTime>> {
    return paginate(({ limit, offset }) => this.sql<SalesManagerStats[]>`
      WITH raw_stats AS (
        SELECT
          CONCAT(sm.first_name, ' ', sm.last_name) AS sales_manager_name,
          COUNT(l.id) AS leads_assigned,
          COUNT(CASE WHEN l.status = 'WON' THEN 1 END) AS leads_won,
          (COUNT(CASE WHEN l.status = 'WON' THEN 1 END)::float / COUNT(l.id)) AS conversion_rate,
          sm.company_id as company_id
        FROM sales_managers sm
        JOIN sales_manager_leads sml ON sm.id = sml.sales_manager_id
        JOIN leads l ON sml.lead_id = l.id
        WHERE sm.company_id >= ${companyIdRange.from}
          AND sm.company_id <= ${companyIdRange.to}
          AND l.created_at >= ${timeframe.from}
          AND l.created_at <= ${timeframe.to}
        GROUP BY sm.company_id, sm.id
        ORDER BY conversion_rate DESC, leads_assigned DESC, leads_won DESC
      )
      SELECT *
      FROM raw_stats
      WHERE conversion_rate >= ${targetConversionRate}
      ORDER BY conversion_rate DESC, leads_assigned DESC, leads_won DESC
      LIMIT ${limit}
      OFFSET ${offset}
    `, { middleware: withExecutionTime });
  }

  async list(): Promise<Page<SalesManager>> {
    return paginate(({ limit, offset }) => this.sql<SalesManager[]>`
      SELECT *
      FROM sales_managers
      ORDER BY id ASC
      LIMIT ${limit}
      OFFSET ${offset}
    `);
  }

  async create({
    companyId,
    firstName,
    lastName
  }: CreateSalesManagerFields): Promise<SalesManager> {
    const result = await this.sql<SalesManager[]>`
      INSERT INTO sales_managers (company_id, first_name, last_name)
      VALUES (${companyId}, ${firstName}, ${lastName})
      RETURNING *
    `;

    return result[0];
  }

  async createRandom(count: number): Promise<Page<SalesManager>> {
    return paginateInMemory(() => this.sql<SalesManager[]>`
      WITH
        random_first_names AS (SELECT first_name FROM first_names ORDER BY random()),
        random_last_names AS (SELECT last_name FROM last_names ORDER BY random()),
        random_company_ids AS (SELECT id AS company_id FROM companies ORDER BY random())
      INSERT INTO sales_managers (first_name, last_name, company_id)
      SELECT
        (SELECT first_name FROM random_first_names OFFSET (i % (SELECT count(*) FROM random_first_names)) LIMIT 1),
        (SELECT last_name FROM random_last_names OFFSET (i % (SELECT count(*) FROM random_last_names)) LIMIT 1),
        (SELECT company_id FROM random_company_ids OFFSET (i % (SELECT count(*) FROM random_company_ids)) LIMIT 1)
      FROM generate_series(1, ${count}) i
      RETURNING *
    `);
  }

  async update(
    id: number,
    fields: UpdateSalesManagerFields,
  ): Promise<SalesManager> {
    const result = await this.sql<SalesManager[]>`
      UPDATE sales_managers
      SET ${this.sql(fields)}
      WHERE id = ${id}
      RETURNING *
    `;

    if (result.length === 0) {
      throw new Error(`Sales manager with id ${id} not found`);
    }

    return result[0];
  }

  async delete(id: number): Promise<SalesManager> {
    const result = await this.sql<SalesManager[]>`
      DELETE
      FROM sales_managers
      WHERE id = ${id}
      RETURNING *
    `;

    if (result.length === 0) {
      throw new Error(`Sales manager with id ${id} not found`);
    }

    return result[0];
  }
}
