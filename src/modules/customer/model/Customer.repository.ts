import { PaginationParams, Repository } from "@/core/repository";
import { CreateCustomerFields, Customer, UpdateCustomerFields } from "@/modules/customer/model/Customer.entity.ts";

export class CustomerRepository extends Repository {
  async findCustomerById(id: number): Promise<Customer | null> {
    const result = await this.sql<Customer[]>`
      SELECT *
      FROM customers
      WHERE id = ${id}
    `;

    if (result.length === 0) {
      return null;
    }

    return result[0];
  }

  async getAllCustomers({
    limit = 20,
    offset = 0,
  }: PaginationParams): Promise<Customer[]> {
    return this.sql<Customer[]>`
      SELECT * FROM customers LIMIT ${limit} OFFSET ${offset}
    `;
  }

  async createCustomer({
    firstName,
    lastName,
    phoneNumber,
    email
  }: CreateCustomerFields): Promise<Customer> {
    const result = await this.sql<Customer[]>`
      INSERT INTO customers (first_name, last_name, phone_number, email)
      VALUES (${firstName}, ${lastName}, ${phoneNumber}, ${email})
      RETURNING *
    `;

    return result[0];
  }

  async updateCustomer(
    id: number,
    fields: UpdateCustomerFields,
  ): Promise<Customer> {
    const result = await this.sql<Customer[]>`
      UPDATE customers
      SET ${this.updates(fields)}
      WHERE id = ${id}
      RETURNING *
    `;

    if (result.length === 0) {
      throw new Error(`Customer with id ${id} not found`);
    }

    return result[0];
  }

  async deleteCustomer(id: number): Promise<Customer> {
    const result = await this.sql<Customer[]>`
      DELETE
      FROM customers
      WHERE id = ${id}
      RETURNING *
    `;

    if (result.length === 0) {
      throw new Error(`Customer with id ${id} not found`);
    }

    return result[0];
  }
}
