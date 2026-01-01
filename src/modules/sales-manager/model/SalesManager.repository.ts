import { PaginationParams, Repository } from "@/core/repository";
import { CreateSalesManagerFields, SalesManager, UpdateSalesManagerFields } from "@/modules/sales-manager/model/SalesManager.entity.ts";

export class SalesManagerRepository extends Repository {
  private salesManager = `
    id,
    company_id AS "companyId",
    first_name AS "firstName",
    last_name AS "lastName"
  `;

  async findSalesManagerById(id: number): Promise<SalesManager | null> {
    const result = await this.db.query<SalesManager>`
      SELECT ${this.salesManager}
      FROM sales_managers
      WHERE id = ${id};
    `;

    if (result.length === 0) {
      return null;
    }

    return result[0];
  }

  async getAllSalesManagers({
    limit = 20,
    offset = 0,
  }: PaginationParams): Promise<SalesManager[]> {
    const result = await this.db.query<SalesManager>`
      SELECT ${this.salesManager}
      FROM sales_managers
      LIMIT ${limit}
      OFFSET ${offset};
    `;

    return result;
  }

  async createSalesManager({
    companyId,
    firstName,
    lastName
  }: CreateSalesManagerFields): Promise<SalesManager> {
    const result = await this.db.query<SalesManager>`
      INSERT INTO sales_managers (company_id, first_name, last_name)
      VALUES (${companyId}, ${firstName}, ${lastName})
      RETURNING ${this.salesManager};
    `;

    return result[0];
  }

  async updateSalesManager(
    id: number,
    fields: UpdateSalesManagerFields,
  ): Promise<SalesManager> {
    const result = await this.db.query<SalesManager>`
      UPDATE sales_managers
      SET ${this.safeSet('company_id', fields.companyId)},
          ${this.safeSet('first_name', fields.firstName)},
          ${this.safeSet('last_name', fields.lastName)}
      WHERE id = ${id}
      RETURNING ${this.salesManager};
    `;

    if (result.length === 0) {
      throw new Error(`Sales manager with id ${id} not found`);
    }

    return result[0];
  }

  async deleteSalesManager(id: number): Promise<SalesManager> {
    const result = await this.db.query<SalesManager>`
      DELETE FROM sales_managers
      WHERE id = ${id}
      RETURNING ${this.salesManager};
    `;

    if (result.length === 0) {
      throw new Error(`Sales manager with id ${id} not found`);
    }

    return result[0];
  }
}
