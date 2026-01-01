import { makeCommand } from "@/core/command";
import { CommandOption } from "@/core/command/CommandOption";
import { CommandOptionSchema } from "@/core/command/CommandOptionSchema";
import { UpdateSalesManagerController } from "@/modules/sales-manager/controllers";

export const updateSalesManagerCommand = makeCommand({
  name: "update",
  description: "Update an existing sales manager",
  controller: new UpdateSalesManagerController(),
  schema: new CommandOptionSchema({
    id: CommandOption.int({
      alias: "id",
      description: "The ID of the sales manager to update",
      isRequired: true,
    }),
    companyId: CommandOption.int({
      alias: "company-id",
      description: "The new company ID",
      isRequired: false,
    }),
    firstName: CommandOption.string({
      alias: "first-name",
      description: "The new first name",
      isRequired: false,
    }),
    lastName: CommandOption.string({
      alias: "last-name",
      description: "The new last name",
      isRequired: false,
    }),
  }),
});
