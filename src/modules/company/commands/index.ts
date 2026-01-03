import { readAllCompaniesCommand } from "./readAllCompanies.command.ts";
import { readOneCompanyCommand } from "./readOneCompany.command.ts";
import { createCompanyCommand } from "./createCompany.command.ts";
import { updateCompanyCommand } from "./updateCompany.command.ts";
import { deleteCompanyCommand } from "./deleteCompany.command.ts";
import { findCompaniesByNameCommand } from "./findCompaniesByName.command.ts";
import { makeBranchCommand } from '@/core/command/makeBranchCommand.ts';

const subcommands = [
  readAllCompaniesCommand,
  readOneCompanyCommand,
  createCompanyCommand,
  updateCompanyCommand,
  deleteCompanyCommand,
  findCompaniesByNameCommand,
];

export const companyCommandBranch = makeBranchCommand({
  name: "company",
  description: 'Commands related to "companies" table.',
  subcommands,
});
