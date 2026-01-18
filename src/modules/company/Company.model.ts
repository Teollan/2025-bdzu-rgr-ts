import { Model } from "@/core/model/Model";
import { paginate, Page, paginateInMemory } from "@/lib/pagination";
import { withExecutionTime, WithExecutionTime } from "@/lib/stopwatch";
import { Company, CompanyWithCustomerCount, CreateCompanyFields, UpdateCompanyFields } from "@/modules/company/Company.entity";

export class CompanyModel extends Model {
  async findById(id: number): Promise<Company | null> {
    const result = await this.sql<Company[]>`
      SELECT *
      FROM companies
      WHERE id = ${id}
    `;

    if (result.length === 0) {
      return null;
    }

    return result[0];
  }

  async findCompaniesWithLargeCustomerBases(minClients: number): Promise<Page<CompanyWithCustomerCount, WithExecutionTime>> {
    return paginate(({ limit, offset }) => this.sql<CompanyWithCustomerCount[]>`
      SELECT
        com.name as company_name,
        COUNT(cus.id) AS customer_count
      FROM companies com
      INNER JOIN leads l ON com.id = l.company_id
      INNER JOIN customers cus ON cus.id = l.customer_id
      GROUP BY com.id
      HAVING COUNT(cus.id) >= ${minClients}
      ORDER BY customer_count DESC
      LIMIT ${limit}
      OFFSET ${offset}
    `, { middleware: withExecutionTime });
  }

  async list(): Promise<Page<Company>> {
    return paginate(({ limit, offset }) => this.sql<Company[]>`
      SELECT *
      FROM companies
      LIMIT ${limit}
      OFFSET ${offset}
    `);
  }

  async create({
    name
  }: CreateCompanyFields): Promise<Company> {
    const result = await this.sql<Company[]>`
      INSERT INTO companies (name)
      VALUES (${name})
      RETURNING *
    `;

    return result[0];
  }

  async createRandom(count: number): Promise<Page<Company>> {
    return paginateInMemory(() => this.sql<Company[]>`
      WITH lookup AS (
        SELECT concat_ws(' ', adjective, noun, designator) AS name
        FROM adjectives, nouns, designators
        ORDER BY random()
      )
      INSERT INTO companies (name)
      SELECT (
        SELECT name
        FROM lookup
        OFFSET (i % (SELECT count(*) FROM lookup))
        LIMIT 1
      ) FROM generate_series(1, ${count}) i
      RETURNING *
    `);
  }

  async update(
    id: number,
    fields: UpdateCompanyFields,
  ): Promise<Company> {
    const result = await this.sql<Company[]>`
      UPDATE companies
      SET ${this.sql(fields)}
      WHERE id = ${id}
      RETURNING *
    `;

    if (result.length === 0) {
      throw new Error(`Company with id ${id} not found`);
    }

    return result[0];
  }

  async delete(id: number): Promise<Company> {
    const result = await this.sql<Company[]>`
      DELETE
      FROM companies
      WHERE id = ${id}
      RETURNING *
    `;

    if (result.length === 0) {
      throw new Error(`Company with id ${id} not found`);
    }

    return result[0];
  }
}
