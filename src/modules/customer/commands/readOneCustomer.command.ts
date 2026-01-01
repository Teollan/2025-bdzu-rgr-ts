import { makeCommand } from "@/core/command";
import { CommandOption } from "@/core/command/CommandOption";
import { CommandOptionSchema } from "@/core/command/CommandOptionSchema";
import { ReadOneCustomerController } from "@/modules/customer/controllers";

export const readOneCustomerCommand = makeCommand({
  name: "read-one",
  description: "Read customer by ID",
  controller: new ReadOneCustomerController(),
  schema: new CommandOptionSchema({
    id: CommandOption.int({
      alias: "id",
      description: "The ID of the customer to read",
      isRequired: true,
    }),
  }),
});
