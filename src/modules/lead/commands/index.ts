import { readAllLeadsCommand } from "./readAllLeads.command.ts";
import { readOneLeadCommand } from "./readOneLead.command.ts";
import { createLeadCommand } from "./createLead.command.ts";
import { updateLeadCommand } from "./updateLead.command.ts";
import { deleteLeadCommand } from "./deleteLead.command.ts";
import { makeBranchCommand } from "@/core/command/makeBranchCommand.ts";

const subcommands = [
  readAllLeadsCommand,
  readOneLeadCommand,
  createLeadCommand,
  updateLeadCommand,
  deleteLeadCommand,
];

export const leadCommandBranch = makeBranchCommand({
  name: "lead",
  description: 'Commands related to "leads" table.',
  subcommands,
});
