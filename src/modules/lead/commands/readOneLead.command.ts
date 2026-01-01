import { makeCommand } from "@/core/command";
import { CommandOption } from "@/core/command/CommandOption";
import { CommandOptionSchema } from "@/core/command/CommandOptionSchema";
import { ReadOneLeadController } from "@/modules/lead/controllers";

export const readOneLeadCommand = makeCommand({
  name: "read-one",
  description: "Read lead by ID",
  controller: new ReadOneLeadController(),
  schema: new CommandOptionSchema({
    id: CommandOption.int({
      alias: "id",
      description: "The ID of the lead to read",
      isRequired: true,
    }),
  }),
});
