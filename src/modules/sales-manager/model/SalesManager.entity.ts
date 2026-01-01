export interface SalesManager {
  id: number;
  companyId: number;
  firstName: string;
  lastName: string;
}

export type UpdateSalesManagerFields = Partial<Omit<SalesManager, "id">>;

export type CreateSalesManagerFields = Pick<SalesManager, "companyId" | "firstName" | "lastName">;
