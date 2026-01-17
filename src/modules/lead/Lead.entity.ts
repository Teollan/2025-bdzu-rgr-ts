export enum LeadStatus {
  Pending = "PENDING",
  InProgress = "IN_PROGRESS",
  Won = "WON",
  Lost = "LOST",
};

export interface Lead {
  id: number;
  companyId: number;
  customerId: number;
  status: LeadStatus;
  createdAt: Date;
}

export interface SalesManagerLead {
  salesManagerId: number;
  leadId: number;
}

export interface LeadCompanySalesManager {
  leadId: number;
  companyName: string;
  salesManagerName: string;
}

export type UpdateLeadFields = Partial<Omit<Lead, "id" | "createdAt">>;

export type CreateLeadFields = Pick<Lead, "companyId" | "customerId" | "status">;