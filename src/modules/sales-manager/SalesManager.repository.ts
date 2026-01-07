import { PaginationParams, Repository } from "@/core/repository";
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

  async list({
    limit = 20,
    offset = 0,
  }: PaginationParams = {}): Promise<SalesManager[]> {
    return this.sql<SalesManager[]>`
      SELECT *
      FROM sales_managers
      LIMIT ${limit}
      OFFSET ${offset}
    `;
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
