import { makeCommand } from "@/core/command";
import { CommandOption } from "@/core/command/CommandOption";
import { CommandOptionSchema } from "@/core/command/CommandOptionSchema";
import { ReadOneSalesManagerController } from "@/modules/sales-manager/controllers";

export const readOneSalesManagerCommand = makeCommand({
  name: "read-one",
  description: "Read sales manager by ID",
  controller: new ReadOneSalesManagerController(),
  schema: new CommandOptionSchema({
    id: CommandOption.int({
      alias: "id",
      description: "The ID of the sales manager to read",
      isRequired: true,
    }),
  }),
});
