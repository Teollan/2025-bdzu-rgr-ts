import { Repository } from "@/core/repository/Repository";
import { paginate, pseudoPaginate, Paginated } from "@/lib/pagination";
import { CreateSalesManagerFields, SalesManager, UpdateSalesManagerFields } from "@/modules/sales-manager/SalesManager.entity";

export class SalesManagerRepository extends Repository {
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

  list(): Promise<Paginated<SalesManager>> {
    return paginate(({ limit, offset }) => this.sql<SalesManager[]>`
      SELECT *
      FROM sales_managers
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

  createRandom(count: number): Promise<Paginated<SalesManager>> {
    return pseudoPaginate(() => this.sql<SalesManager[]>`
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
      SET ${this.updates(fields)}
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
