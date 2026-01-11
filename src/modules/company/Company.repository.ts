import { Repository } from "@/core/repository/Repository";
import { paginate, Paginated, pseudoPaginate } from "@/lib/pagination";
import { Company, CreateCompanyFields, UpdateCompanyFields } from "@/modules/company/Company.entity";

export class CompanyRepository extends Repository {
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

  list(): Promise<Paginated<Company>> {
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

  createRandom(count: number): Promise<Paginated<Company>> {
    return pseudoPaginate(() => this.sql<Company[]>`
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
      SET ${this.updates(fields)}
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
