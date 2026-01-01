import { makeCommand } from "@/core/command";
import { CommandOption } from "@/core/command/CommandOption";
import { CommandOptionSchema } from "@/core/command/CommandOptionSchema";
import { UpdateCustomerController } from "@/modules/customer/controllers";

export const updateCustomerCommand = makeCommand({
  name: "update",
  description: "Update an existing customer",
  controller: new UpdateCustomerController(),
  schema: new CommandOptionSchema({
    id: CommandOption.int({
      alias: "id",
      description: "The ID of the customer to update",
      isRequired: true,
    }),
    firstName: CommandOption.string({
      alias: "first-name",
      description: "The new first name",
      isRequired: false,
    }),
    lastName: CommandOption.string({
      alias: "last-name",
      description: "The new last name",
      isRequired: false,
    }),
    phoneNumber: CommandOption.string({
      alias: "phone-number",
      description: "The new phone number",
      isRequired: false,
    }),
    email: CommandOption.string({
      alias: "email",
      description: "The new email",
      isRequired: false,
    }),
  }),
});
