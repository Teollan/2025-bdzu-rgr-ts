import { Command } from "commander";
import { companiesCommand } from "@/modules/company";
import { salesManagersCommand } from "@/modules/sales-manager";
import { customersCommand } from "@/modules/customer";
import { leadsCommand } from "@/modules/lead";
import { makeAndConnectDatabase } from '@/core/database';

export const main = async (): Promise<void> => {
  await makeAndConnectDatabase();

  const program = new Command('rgr');

  program.description("A command-line CRM application");

  program.addCommand(companiesCommand);
  program.addCommand(salesManagersCommand);
  program.addCommand(customersCommand);
  program.addCommand(leadsCommand);

  await program.parseAsync(process.argv);

  process.exit(0);
}
