import { Repository } from "@/core/repository";
import { SalesManager } from "@/modules/sales-manager/model/SalesManager.entity.ts";

export class SalesManagerRepository extends Repository {
  private toEntity(row: Record<string, unknown>): SalesManager {
    return {
      id: row.id as number,
      companyId: row.company_id as number,
      firstName: row.first_name as string,
      lastName: row.last_name as string,
    };
  }

  async findSalesManagerById(id: number): Promise<SalesManager | null> {
    const result = await this.db`
      SELECT *
      FROM sales_managers
      WHERE id = ${id};
    `;

    if (result.length === 0) {
      return null;
    }

    return this.toEntity(result[0]);
  }

  async getAllSalesManagers(limit: number = 20, offset: number = 0): Promise<SalesManager[]> {
    const result = await this.db`
      SELECT *
      FROM sales_managers
      LIMIT ${limit}
      OFFSET ${offset};
    `;

    return result.map((row) => this.toEntity(row));
  }

  async createSalesManager(companyId: number, firstName: string, lastName: string): Promise<SalesManager> {
    const result = await this.db`
      INSERT INTO sales_managers (company_id, first_name, last_name)
      VALUES (${companyId}, ${firstName}, ${lastName})
      RETURNING *;
    `;

    return this.toEntity(result[0]);
  }

  async updateSalesManager(
    id: number,
    companyId?: number,
    firstName?: string,
    lastName?: string
  ): Promise<SalesManager> {
    const result = await this.db`
      UPDATE sales_managers
      SET company_id = COALESCE(${companyId ?? null}, company_id),
          first_name = COALESCE(${firstName ?? null}, first_name),
          last_name = COALESCE(${lastName ?? null}, last_name)
      WHERE id = ${id}
      RETURNING *;
    `;

    if (result.length === 0) {
      throw new Error(`Sales manager with id ${id} not found`);
    }

    return this.toEntity(result[0]);
  }

  async deleteSalesManager(id: number): Promise<SalesManager> {
    const result = await this.db`
      DELETE FROM sales_managers
      WHERE id = ${id}
      RETURNING *;
    `;

    if (result.length === 0) {
      throw new Error(`Sales manager with id ${id} not found`);
    }

    return this.toEntity(result[0]);
  }
}
