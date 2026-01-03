import { readAllSalesManagersCommand } from "./readAllSalesManagers.command.ts";
import { readOneSalesManagerCommand } from "./readOneSalesManager.command.ts";
import { createSalesManagerCommand } from "./createSalesManager.command.ts";
import { updateSalesManagerCommand } from "./updateSalesManager.command.ts";
import { deleteSalesManagerCommand } from "./deleteSalesManager.command.ts";
import { makeBranchCommand } from "@/core/command/makeBranchCommand.ts";

const subcommands = [
  readAllSalesManagersCommand,
  readOneSalesManagerCommand,
  createSalesManagerCommand,
  updateSalesManagerCommand,
  deleteSalesManagerCommand,
];

export const salesManagerCommandBranch = makeBranchCommand({
  name: "sales-manager",
  description: 'Commands related to "sales_managers" table.',
  subcommands,
});
