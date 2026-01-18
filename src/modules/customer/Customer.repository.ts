import { Repository } from "@/core/repository/Repository";
import { paginate, Page, paginateInMemory } from "@/lib/pagination";
import { withExecutionTime, WithExecutionTime } from "@/lib/stopwatch";
import { Range } from '@/lib/range';
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

  async findCustomersContactedBySalesManager({
    salesManagerNameLike,
    timeframe,
  }: {
    salesManagerNameLike: string;
    timeframe: Range<Date>;
  }): Promise<Page<Customer, WithExecutionTime>> {
    return paginate(({ limit, offset }) => this.sql<Customer[]>`
      SELECT DISTINCT cus.*
      FROM customers cus
      JOIN leads l ON cus.id = l.customer_id
      JOIN sales_manager_leads sml ON l.id = sml.lead_id
      JOIN sales_managers sm ON sml.sales_manager_id = sm.id
      WHERE concat(sm.first_name, ' ', sm.last_name) ILIKE ${`%${salesManagerNameLike}%`}
        AND l.created_at >= ${timeframe.from}
        AND l.created_at <= ${timeframe.to}
      GROUP BY l.status, cus.id
      ORDER BY cus.id
      LIMIT ${limit}
      OFFSET ${offset}
    `, { middleware: withExecutionTime });
  }

  async list(): Promise<Page<Customer>> {
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

  createRandom(count: number): Promise<Page<Customer>> {
    return paginateInMemory(() => this.sql<Customer[]>`
      WITH lookup AS (
        SELECT first_name, last_name, domain as email_domain
        FROM first_names, last_names, email_domains
        ORDER BY random()
      )
      INSERT INTO customers (first_name, last_name, email, phone_number)
      SELECT
        first_name,
        last_name,
        lower(concat(
          first_name,
          '.',
          last_name,
          '.',
          chr(65 + (random() * 26)::int),
          chr(65 + (random() * 26)::int),
          chr(65 + (random() * 26)::int),
          chr(65 + (random() * 26)::int),
          '@',
          email_domain
        )) AS email,
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
      ON CONFLICT DO NOTHING
      RETURNING *
    `);
  }

  async update(
    id: number,
    fields: UpdateCustomerFields,
  ): Promise<Customer> {
    const result = await this.sql<Customer[]>`
      UPDATE customers
      SET ${this.sql(fields)}
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
