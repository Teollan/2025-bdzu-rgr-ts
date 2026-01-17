export interface Company {
  id: number;
  name: string;
}

export interface CompanyWithCustomerCount {
  companyName: string;
  customerCount: number;
}

export type UpdateCompanyFields = Partial<Omit<Company, "id">>;

export type CreateCompanyFields = Pick<Company, "name">;