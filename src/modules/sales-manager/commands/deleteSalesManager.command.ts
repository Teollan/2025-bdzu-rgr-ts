import { makeCommand } from "@/core/command";
import { CommandOption } from "@/core/command/CommandOption";
import { CommandOptionSchema } from "@/core/command/CommandOptionSchema";
import { DeleteSalesManagerController } from "@/modules/sales-manager/controllers";

export const deleteSalesManagerCommand = makeCommand({
  name: "delete",
  description: "Delete a sales manager",
  controller: new DeleteSalesManagerController(),
  schema: new CommandOptionSchema({
    id: CommandOption.int({
      alias: "id",
      description: "The ID of the sales manager to delete",
      isRequired: true,
    }),
  }),
});
