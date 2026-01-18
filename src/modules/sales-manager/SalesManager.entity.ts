export interface SalesManager {
  id: number;
  companyId: number;
  firstName: string;
  lastName: string;
}

export interface SalesManagerStats {
  companyId: number;
  salesManagerName: string;
  leadsAssigned: number;
  leadsWon: number;
  conversionRate: number;
}

export type UpdateSalesManagerFields = Partial<Omit<SalesManager, "id">>;

export type CreateSalesManagerFields = Pick<SalesManager, "companyId" | "firstName" | "lastName">;
