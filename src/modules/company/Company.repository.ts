import { PaginationParams, Repository } from "@/core/repository";
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

  async list({
    limit = 20,
    offset = 0,
  }: PaginationParams = {}): Promise<Company[]> {
    return this.sql<Company[]>`
      SELECT *
      FROM companies
      LIMIT ${limit}
      OFFSET ${offset}
    `;
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
