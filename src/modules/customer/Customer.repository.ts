import { Repository } from "@/core/repository/Repository";
import { paginate, Paginated, pseudoPaginate } from "@/lib/pagination";
import { CreateCustomerFields, Customer, UpdateCustomerFields } from "@/modules/customer/Customer.entity";

export class CustomerRepository extends Repository {
  async findById(id: number): Promise<Customer | null> {
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

  list(): Promise<Paginated<Customer>> {
    return paginate(({ limit, offset }) => this.sql<Customer[]>`
      SELECT * FROM customers LIMIT ${limit} OFFSET ${offset}
    `);
  }

  async create({
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

  createRandom(count: number): Promise<Paginated<Customer>> {
    return pseudoPaginate(() => this.sql<Customer[]>`
      WITH lookup AS (
        SELECT first_name, last_name, lower(concat(first_name, '.', last_name, '@', domain)) AS email
        FROM first_names, last_names, email_domains
        ORDER BY random()
      )
      INSERT INTO customers (first_name, last_name, email, phone_number)
      SELECT
        first_name,
        last_name,
        email,
        concat(
          '380',
          (random() * 9)::int::text,
          (random() * 9)::int::text,
          (random() * 9)::int::text,
          (random() * 9)::int::text,
          (random() * 9)::int::text,
          (random() * 9)::int::text,
          (random() * 9)::int::text,
          (random() * 9)::int::text,
          (random() * 9)::int::text
        ) AS phone_number
      FROM generate_series(1, ${count}) i
      CROSS JOIN LATERAL (
        SELECT *
        FROM lookup
        OFFSET (i % (SELECT count(*) FROM lookup))
        LIMIT 1
      ) AS t1
      RETURNING *
    `);
  }

  async update(
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

  async delete(id: number): Promise<Customer> {
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
