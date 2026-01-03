import { readAllCustomersCommand } from "./readAllCustomers.command.ts";
import { readOneCustomerCommand } from "./readOneCustomer.command.ts";
import { createCustomerCommand } from "./createCustomer.command.ts";
import { updateCustomerCommand } from "./updateCustomer.command.ts";
import { deleteCustomerCommand } from "./deleteCustomer.command.ts";
import { makeBranchCommand } from "@/core/command/makeBranchCommand.ts";

const subcommands = [
  readAllCustomersCommand,
  readOneCustomerCommand,
  createCustomerCommand,
  updateCustomerCommand,
  deleteCustomerCommand,
];

export const customerCommandBranch = makeBranchCommand({
  name: "customer",
  description: 'Commands related to "customers" table.',
  subcommands,
});
