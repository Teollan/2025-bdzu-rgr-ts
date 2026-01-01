import { makeCommand } from "@/core/command";
import { CommandOption } from "@/core/command/CommandOption";
import { CommandOptionSchema } from "@/core/command/CommandOptionSchema";
import { FindCompaniesByNameController } from "@/modules/company/controllers";

export const findCompaniesByNameCommand = makeCommand({
  name: "find-by-name",
  description: "Find companies by name",
  controller: new FindCompaniesByNameController(),
  schema: new CommandOptionSchema({
    name: CommandOption.string({
      alias: "name",
      description: "The name to search for",
      isRequired: true,
    }),
  }),
});
