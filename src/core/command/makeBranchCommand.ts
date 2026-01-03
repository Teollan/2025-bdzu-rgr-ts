import { Command } from 'commander';

export interface BrachCommandConfig {
  name: string;
  description: string;
  subcommands: Command[];
  helpCommand?: boolean;
}

export const makeBranchCommand = ({
  name,
  description,
  subcommands,
  helpCommand = false,
}: BrachCommandConfig): Command => {
  const command = new Command(name);

  command.description(description);
  command.exitOverride();
  command.usage('[subcommand]');
  command.helpCommand(helpCommand);

  subcommands.forEach((subcommand) => {
    command.addCommand(subcommand);
  });

  return command;
};