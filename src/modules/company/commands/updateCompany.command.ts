import { makeCommand } from "@/core/command";
import { CommandOption } from "@/core/command/CommandOption";
import { CommandOptionSchema } from "@/core/command/CommandOptionSchema";
import { UpdateCompanyController } from "@/modules/company/controllers";

export const updateCompanyCommand = makeCommand({
  name: "update",
  description: "Update an existing company",
  controller: new UpdateCompanyController(),
  schema: new CommandOptionSchema({
    id: CommandOption.int({
      alias: "id",
      description: "The ID of the company to update",
      isRequired: true,
    }),
    name: CommandOption.string({
      alias: "name",
      description: "The new name",
      isRequired: false,
    }),
  }),
});
