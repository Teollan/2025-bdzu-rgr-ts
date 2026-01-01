export interface Company {
  id: number;
  name: string;
}

export type UpdateCompanyFields = Partial<Omit<Company, "id">>;

export type CreateCompanyFields = Pick<Company, "name">;