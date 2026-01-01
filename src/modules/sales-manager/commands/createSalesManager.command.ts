import { makeCommand } from "@/core/command";
import { CommandOption } from "@/core/command/CommandOption";
import { CommandOptionSchema } from "@/core/command/CommandOptionSchema";
import { CreateSalesManagerController } from "@/modules/sales-manager/controllers";

export const createSalesManagerCommand = makeCommand({
  name: "create",
  description: "Create a new sales manager",
  controller: new CreateSalesManagerController(),
  schema: new CommandOptionSchema({
    companyId: CommandOption.int({
      alias: "company-id",
      description: "The company ID",
      isRequired: true,
    }),
    firstName: CommandOption.string({
      alias: "first-name",
      description: "The first name",
      isRequired: true,
    }),
    lastName: CommandOption.string({
      alias: "last-name",
      description: "The last name",
      isRequired: true,
    }),
  }),
});
