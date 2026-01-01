export interface Customer {
  id: number;
  firstName: string;
  lastName: string;
  phoneNumber: string;
  email: string;
}

export type UpdateCustomerFields = Partial<Omit<Customer, "id">>;

export type CreateCustomerFields = Pick<Customer, "firstName" | "lastName" | "phoneNumber" | "email">;