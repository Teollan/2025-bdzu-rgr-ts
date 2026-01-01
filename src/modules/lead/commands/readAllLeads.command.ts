import { makeCommand } from "@/core/command";
import { CommandOption } from "@/core/command/CommandOption";
import { CommandOptionSchema } from "@/core/command/CommandOptionSchema";
import { ReadAllLeadsController } from "@/modules/lead/controllers";

export const readAllLeadsCommand = makeCommand({
  name: "read-all",
  description: "Read all leads",
  controller: new ReadAllLeadsController(),
  schema: new CommandOptionSchema({
    limit: CommandOption.int({
      alias: "limit",
      description: "Maximum number of leads to return",
      isRequired: false,
      defaultValue: 10,
    }),
    offset: CommandOption.int({
      alias: "offset",
      description: "Number of leads to skip",
      isRequired: false,
      defaultValue: 0,
    }),
  }),
});
