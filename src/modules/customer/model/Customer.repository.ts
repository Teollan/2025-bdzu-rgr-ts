import { PaginationParams, Repository } from "@/core/repository";
import { CreateCustomerFields, Customer, UpdateCustomerFields } from "@/modules/customer/model/Customer.entity.ts";

export class CustomerRepository extends Repository {
  private customer = `
    id,
    first_name AS "firstName",
    last_name AS "lastName",
    phone_number AS "phoneNumber",
    email
  `

  async findCustomerById(id: number): Promise<Customer | null> {
    const result = await this.db.query<Customer>`
      SELECT ${this.customer}
      FROM customers
      WHERE id = ${id};
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
    const result = await this.db.query<Customer>`
      SELECT ${this.customer}
      FROM customers
      LIMIT ${limit}
      OFFSET ${offset};
    `;

    return result;
  }

  async createCustomer({
    firstName,
    lastName,
    phoneNumber,
    email
  }: CreateCustomerFields): Promise<Customer> {
    const result = await this.db.query<Customer>`
      INSERT INTO customers (first_name, last_name, phone_number, email)
      VALUES (${firstName}, ${lastName}, ${phoneNumber}, ${email})
      RETURNING ${this.customer};
    `;

    return result[0];
  }

  async updateCustomer(
    id: number,
    fields: UpdateCustomerFields,
  ): Promise<Customer> {
    const result = await this.db.query<Customer>`
      UPDATE customers
      SET ${this.safeSet('first_name', fields.firstName)},
          ${this.safeSet('last_name', fields.lastName)},
          ${this.safeSet('phone_number', fields.phoneNumber)},
          ${this.safeSet('email', fields.email)}
      WHERE id = ${id}
      RETURNING ${this.customer};
    `;

    if (result.length === 0) {
      throw new Error(`Customer with id ${id} not found`);
    }

    return result[0];
  }

  async deleteCustomer(id: number): Promise<Customer> {
    const result = await this.db.query<Customer>`
      DELETE FROM customers
      WHERE id = ${id}
      RETURNING ${this.customer};
    `;

    if (result.length === 0) {
      throw new Error(`Customer with id ${id} not found`);
    }

    return result[0];
  }
}
