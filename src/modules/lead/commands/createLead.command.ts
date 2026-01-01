import { makeCommand } from "@/core/command";
import { CommandOption } from "@/core/command/CommandOption";
import { CommandOptionSchema } from "@/core/command/CommandOptionSchema";
import { CreateLeadController } from "@/modules/lead/controllers";
import { LeadStatus } from '@/modules/lead/model';

export const createLeadCommand = makeCommand({
  name: "create",
  description: "Create a new lead",
  controller: new CreateLeadController(),
  schema: new CommandOptionSchema({
    companyId: CommandOption.int({
      alias: "company-id",
      description: "The company ID",
      isRequired: true,
    }),
    customerId: CommandOption.int({
      alias: "customer-id",
      description: "The customer ID",
      isRequired: true,
    }),
    status: CommandOption.enum(LeadStatus, {
      alias: "status",
      description: "The status",
      isRequired: true,
    }),
  }),
});
