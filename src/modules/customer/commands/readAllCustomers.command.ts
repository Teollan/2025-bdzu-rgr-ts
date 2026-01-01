import { makeCommand } from "@/core/command";
import { CommandOption } from "@/core/command/CommandOption";
import { CommandOptionSchema } from "@/core/command/CommandOptionSchema";
import { ReadAllCustomersController } from "@/modules/customer/controllers";

export const readAllCustomersCommand = makeCommand({
  name: "read-all",
  description: "Read all customers",
  controller: new ReadAllCustomersController(),
  schema: new CommandOptionSchema({
    limit: CommandOption.int({
      alias: "limit",
      description: "Maximum number of customers to return",
      isRequired: false,
      defaultValue: 10,
    }),
    offset: CommandOption.int({
      alias: "offset",
      description: "Number of customers to skip",
      isRequired: false,
      defaultValue: 0,
    }),
  }),
});
