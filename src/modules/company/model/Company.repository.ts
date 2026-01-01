import { Repository } from "@/core/repository";
import { Company } from "@/modules/company/model/Company.entity.ts";

export class CompanyRepository extends Repository {
  private toEntity(row: Record<string, unknown>): Company {
    return {
      id: row.id as number,
      name: row.name as string,
    };
  }

  async findCompanyById(id: number): Promise<Company | null> {
    const result = await this.db`
      SELECT *
      FROM companies
      WHERE id = ${id};
    `;

    if (result.length === 0) {
      return null;
    }

    return this.toEntity(result[0]);
  }

  async findCompaniesByName(name: string): Promise<Company[]> {
    const result = await this.db`
      SELECT *
      FROM companies
      WHERE name ILIKE ${"%" + name + "%"};
    `;

    return result.map((row) => this.toEntity(row));
  }

  async getAllCompanies(limit: number = 20, offset: number = 0): Promise<Company[]> {
    const result = await this.db`
      SELECT *
      FROM companies
      LIMIT ${limit}
      OFFSET ${offset};
    `;

    return result.map((row) => this.toEntity(row));
  }

  async createCompany(name: string): Promise<Company> {
    const result = await this.db`
      INSERT INTO companies (name)
      VALUES (${name})
      RETURNING *;
    `;

    return this.toEntity(result[0]);
  }

  async updateCompany(id: number, name?: string): Promise<Company> {
    const result = await this.db`
      UPDATE companies
      SET name = COALESCE(${name ?? null}, name)
      WHERE id = ${id}
      RETURNING *;
    `;

    if (result.length === 0) {
      throw new Error(`Company with id ${id} not found`);
    }

    return this.toEntity(result[0]);
  }

  async deleteCompany(id: number): Promise<Company> {
    const result = await this.db`
      DELETE FROM companies
      WHERE id = ${id}
      RETURNING *;
    `;

    if (result.length === 0) {
      throw new Error(`Company with id ${id} not found`);
    }

    return this.toEntity(result[0]);
  }
}
