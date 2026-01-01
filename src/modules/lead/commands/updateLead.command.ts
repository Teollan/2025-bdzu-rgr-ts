import { makeCommand } from "@/core/command";
import { CommandOption } from "@/core/command/CommandOption";
import { CommandOptionSchema } from "@/core/command/CommandOptionSchema";
import { UpdateLeadController } from "@/modules/lead/controllers";

export const updateLeadCommand = makeCommand({
  name: "update",
  description: "Update an existing lead",
  controller: new UpdateLeadController(),
  schema: new CommandOptionSchema({
    id: CommandOption.int({
      alias: "id",
      description: "The ID of the lead to update",
      isRequired: true,
    }),
    companyId: CommandOption.int({
      alias: "company-id",
      description: "The new company ID",
      isRequired: false,
    }),
    customerId: CommandOption.int({
      alias: "customer-id",
      description: "The new customer ID",
      isRequired: false,
    }),
    status: CommandOption.string({
      alias: "status",
      description: "The new status",
      isRequired: false,
    }),
  }),
});
