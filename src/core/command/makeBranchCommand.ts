import { Command } from 'commander';

export interface BrachCommandConfig {
  name: string;
  description: string;
  subcommands: Command[];
}

export const makeBranchCommand = ({
  name,
  description,
  subcommands,
}: BrachCommandConfig): Command => {
  const command = new Command(name);

  command.description(description);

  subcommands.forEach((subcommand) => {
    command.addCommand(subcommand);
  });

  return command;
};