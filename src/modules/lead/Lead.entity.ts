export enum LeadStatus {
  Pending = "pending",
  InProgress = "in-progress",
  Won = "won",
  Lost = "lost",
};

export interface Lead {
  id: number;
  companyId: number;
  customerId: number;
  status: LeadStatus;
  createdAt: Date;
}

export type UpdateLeadFields = Partial<Omit<Lead, "id" | "createdAt">>;

export type CreateLeadFields = Pick<Lead, "companyId" | "customerId" | "status">;