import { makeCommand } from "@/core/command";
import { CommandOption } from "@/core/command/CommandOption";
import { CommandOptionSchema } from "@/core/command/CommandOptionSchema";
import { DeleteLeadController } from "@/modules/lead/controllers";

export const deleteLeadCommand = makeCommand({
  name: "delete",
  description: "Delete a lead",
  controller: new DeleteLeadController(),
  schema: new CommandOptionSchema({
    id: CommandOption.int({
      alias: "id",
      description: "The ID of the lead to delete",
      isRequired: true,
    }),
  }),
});
