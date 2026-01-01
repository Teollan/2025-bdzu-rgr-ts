import { makeCommand } from "@/core/command";
import { CommandOption } from "@/core/command/CommandOption";
import { CommandOptionSchema } from "@/core/command/CommandOptionSchema";
import { DeleteCompanyController } from "@/modules/company/controllers";

export const deleteCompanyCommand = makeCommand({
  name: "delete",
  description: "Delete a company",
  controller: new DeleteCompanyController(),
  schema: new CommandOptionSchema({
    id: CommandOption.int({
      alias: "id",
      description: "The ID of the company to delete",
      isRequired: true,
    }),
  }),
});
