import { makeCommand } from "@/core/command";
import { CommandOption } from "@/core/command/CommandOption";
import { CommandOptionSchema } from "@/core/command/CommandOptionSchema";
import { CreateCompanyController } from "@/modules/company/controllers";

export const createCompanyCommand = makeCommand({
  name: "create",
  description: "Create a new company",
  controller: new CreateCompanyController(),
  schema: new CommandOptionSchema({
    name: CommandOption.string({
      alias: "name",
      description: "The name of the company",
      isRequired: true,
    }),
  }),
});
