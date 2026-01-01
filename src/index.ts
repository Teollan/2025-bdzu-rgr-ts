import { Command } from "commander";
import { Environment } from "@/core/environment";
import { connectDatabase } from "@/core/database";
import { companiesCommand } from "@/modules/company";
import { salesManagersCommand } from "@/modules/sales-manager";
import { customersCommand } from "@/modules/customer";
import { leadsCommand } from "@/modules/lead";

async function main(): Promise<void> {
  connectDatabase({
    host: Environment.dbHost,
    port: Environment.dbPort,
    database: Environment.dbName,
    username: Environment.dbUsername,
    password: Environment.dbPassword,
  });

  const program = new Command();

  program
    .name("rgr")
    .description("A command-line CRM application")
    .version("1.0.0");

  program.addCommand(companiesCommand);
  program.addCommand(salesManagersCommand);
  program.addCommand(customersCommand);
  program.addCommand(leadsCommand);

  await program.parseAsync(process.argv);

  process.exit(0);
}

main().catch((error) => {
  console.error("An unexpected error occurred:", error);
  process.exit(1);
});
