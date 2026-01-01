import { makeCommand } from "@/core/command";
import { CommandOption } from "@/core/command/CommandOption";
import { CommandOptionSchema } from "@/core/command/CommandOptionSchema";
import { ReadAllSalesManagersController } from "@/modules/sales-manager/controllers";

export const readAllSalesManagersCommand = makeCommand({
  name: "read-all",
  description: "Read all sales managers",
  controller: new ReadAllSalesManagersController(),
  schema: new CommandOptionSchema({
    limit: CommandOption.int({
      alias: "limit",
      description: "Maximum number of sales managers to return",
      isRequired: false,
      defaultValue: 10,
    }),
    offset: CommandOption.int({
      alias: "offset",
      description: "Number of sales managers to skip",
      isRequired: false,
      defaultValue: 0,
    }),
  }),
});
