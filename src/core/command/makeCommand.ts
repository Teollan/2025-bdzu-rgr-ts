import { Controller } from "@/core/controller";
import {
  CommandOptionSchema,
  InferSchemaOutput,
  OptionsMap,
} from "@/core/command/CommandOptionSchema";
import { Command } from "commander";

export interface CommandConfig<T extends OptionsMap> {
  name: string;
  description: string;
  controller: Controller<InferSchemaOutput<T>>;
  schema: CommandOptionSchema<T>;
}

export function makeCommand<T extends OptionsMap>({
  name,
  description,
  controller,
  schema,
}: CommandConfig<T>): Command {
  const command = new Command(name);

  command.description(description);
  command.exitOverride();

  schema.options.forEach((option) => {
    const optionFlags = option.isRequired
      ? `--${option.alias} <value>`
      : `--${option.alias} [value]`;

    command.option(
      optionFlags,
      option.description,
      (input) => option.parse(input),
      option.defaultValue
    );
  });

  command.action(async (args) => {
    const parsedArgs = schema.parse(args);

    await controller.run(parsedArgs);
  });

  return command;
}
