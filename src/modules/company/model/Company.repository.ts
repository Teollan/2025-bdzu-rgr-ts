import { PaginationParams, Repository } from "@/core/repository";
import { Company, CreateCompanyFields, UpdateCompanyFields } from "@/modules/company/model/Company.entity.ts";

export class CompanyRepository extends Repository {
  private company = `
    id,
    name
  `

  async findCompanyById(id: number): Promise<Company | null> {
    const result = await this.db.query<Company>`
      SELECT ${this.company}
      FROM companies
      WHERE id = ${id};
    `;

    if (result.length === 0) {
      return null;
    }

    return result[0];
  }

  async findCompaniesByName(name: string): Promise<Company[]> {
    const result = await this.db.query<Company>`
      SELECT ${this.company}
      FROM companies
      WHERE name ILIKE '%${name}%';
    `;

    return result;
  }

  async getAllCompanies({
    limit = 20,
    offset = 0,
  }: PaginationParams): Promise<Company[]> {
    const result = await this.db.query<Company>`
      SELECT ${this.company}
      FROM companies
      LIMIT ${limit}
      OFFSET ${offset};
    `;

    return result;
  }

  async createCompany({
    name
  }: CreateCompanyFields): Promise<Company> {
    const result = await this.db.query<Company>`
      INSERT INTO companies (name)
      VALUES (${name})
      RETURNING ${this.company};
    `;

    return result[0];
  }

  async updateCompany(
    id: number,
    fields: UpdateCompanyFields,
  ): Promise<Company> {
    const result = await this.db.query<Company>`
      UPDATE companies
      SET ${this.safeSet('name', fields.name)}
      WHERE id = ${id}
      RETURNING ${this.company};
    `;

    if (result.length === 0) {
      throw new Error(`Company with id ${id} not found`);
    }

    return result[0];
  }

  async deleteCompany(id: number): Promise<Company> {
    const result = await this.db.query<Company>`
      DELETE FROM companies
      WHERE id = ${id}
      RETURNING ${this.company};
    `;

    if (result.length === 0) {
      throw new Error(`Company with id ${id} not found`);
    }

    return result[0];
  }
}
