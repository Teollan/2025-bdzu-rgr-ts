import { makeCommand } from '@/core/command';
import { CommandOption } from '@/core/command/CommandOption';
import { CommandOptionSchema } from '@/core/command/CommandOptionSchema';
import { ReadAllCompaniesController } from '@/modules/company/controllers';

export const readAllCompaniesCommand = makeCommand({
  name: "read-all",
  description: "Read all companies",
  controller: new ReadAllCompaniesController(),
  schema: new CommandOptionSchema({
    limit: CommandOption.int({
      alias: "limit",
      description: "Maximum number of companies to return",
      isRequired: false,
      defaultValue: 10,
    }),
    offset: CommandOption.int({
      alias: "offset",
      description: "Number of companies to skip",
      isRequired: false,
      defaultValue: 0,
    }),
  }),
});
