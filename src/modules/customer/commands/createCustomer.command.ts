import { makeCommand } from "@/core/command";
import { CommandOption } from "@/core/command/CommandOption";
import { CommandOptionSchema } from "@/core/command/CommandOptionSchema";
import { CreateCustomerController } from "@/modules/customer/controllers";

export const createCustomerCommand = makeCommand({
  name: "create",
  description: "Create a new customer",
  controller: new CreateCustomerController(),
  schema: new CommandOptionSchema({
    firstName: CommandOption.string({
      alias: "first-name",
      description: "The first name",
      isRequired: true,
    }),
    lastName: CommandOption.string({
      alias: "last-name",
      description: "The last name",
      isRequired: true,
    }),
    phoneNumber: CommandOption.string({
      alias: "phone-number",
      description: "The phone number",
      isRequired: true,
    }),
    email: CommandOption.string({
      alias: "email",
      description: "The email",
      isRequired: true,
    }),
  }),
});
