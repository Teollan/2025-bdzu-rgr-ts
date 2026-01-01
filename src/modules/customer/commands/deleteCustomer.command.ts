import { makeCommand } from "@/core/command";
import { CommandOption } from "@/core/command/CommandOption";
import { CommandOptionSchema } from "@/core/command/CommandOptionSchema";
import { DeleteCustomerController } from "@/modules/customer/controllers";

export const deleteCustomerCommand = makeCommand({
  name: "delete",
  description: "Delete a customer",
  controller: new DeleteCustomerController(),
  schema: new CommandOptionSchema({
    id: CommandOption.int({
      alias: "id",
      description: "The ID of the customer to delete",
      isRequired: true,
    }),
  }),
});
