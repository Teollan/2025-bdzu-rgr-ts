export enum LeadStatus {
  Pending = "PENDING",
  InProgress = "IN_PROGRESS",
  Won = "WON",
  Lost = "LOST",
}

export interface Lead {
  id: number;
  companyId: number;
  customerId: number;
  status: LeadStatus;
  createdAt: Date;
}

export type UpdateLeadFields = Partial<Omit<Lead, "id" | "createdAt">>;

export type CreateLeadFields = Pick<Lead, "companyId" | "customerId" | "status">;