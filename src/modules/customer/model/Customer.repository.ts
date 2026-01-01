import { Repository } from "@/core/repository";
import { Customer } from "@/modules/customer/model/Customer.entity.ts";

export class CustomerRepository extends Repository {
  private toEntity(row: Record<string, unknown>): Customer {
    return {
      id: row.id as number,
      firstName: row.first_name as string,
      lastName: row.last_name as string,
      phoneNumber: row.phone_number as string,
      email: row.email as string,
    };
  }

  async findCustomerById(id: number): Promise<Customer | null> {
    const result = await this.db`
      SELECT *
      FROM customers
      WHERE id = ${id};
    `;

    if (result.length === 0) {
      return null;
    }

    return this.toEntity(result[0]);
  }

  async getAllCustomers(limit: number = 20, offset: number = 0): Promise<Customer[]> {
    const result = await this.db`
      SELECT *
      FROM customers
      LIMIT ${limit}
      OFFSET ${offset};
    `;

    return result.map((row) => this.toEntity(row));
  }

  async createCustomer(
    firstName: string,
    lastName: string,
    phoneNumber: string,
    email: string
  ): Promise<Customer> {
    const result = await this.db`
      INSERT INTO customers (first_name, last_name, phone_number, email)
      VALUES (${firstName}, ${lastName}, ${phoneNumber}, ${email})
      RETURNING *;
    `;

    return this.toEntity(result[0]);
  }

  async updateCustomer(
    id: number,
    firstName?: string,
    lastName?: string,
    phoneNumber?: string,
    email?: string
  ): Promise<Customer> {
    const result = await this.db`
      UPDATE customers
      SET first_name = COALESCE(${firstName ?? null}, first_name),
          last_name = COALESCE(${lastName ?? null}, last_name),
          phone_number = COALESCE(${phoneNumber ?? null}, phone_number),
          email = COALESCE(${email ?? null}, email)
      WHERE id = ${id}
      RETURNING *;
    `;

    if (result.length === 0) {
      throw new Error(`Customer with id ${id} not found`);
    }

    return this.toEntity(result[0]);
  }

  async deleteCustomer(id: number): Promise<Customer> {
    const result = await this.db`
      DELETE FROM customers
      WHERE id = ${id}
      RETURNING *;
    `;

    if (result.length === 0) {
      throw new Error(`Customer with id ${id} not found`);
    }

    return this.toEntity(result[0]);
  }
}
