import { makeCommand } from "@/core/command";
import { CommandOption } from "@/core/command/CommandOption";
import { CommandOptionSchema } from "@/core/command/CommandOptionSchema";
import { ReadOneCompanyController } from "@/modules/company/controllers";

export const readOneCompanyCommand = makeCommand({
  name: "read-one",
  description: "Read company by ID",
  controller: new ReadOneCompanyController(),
  schema: new CommandOptionSchema({
    id: CommandOption.int({
      alias: "id",
      description: "The ID of the company to read",
      isRequired: true,
    }),
  }),
});
