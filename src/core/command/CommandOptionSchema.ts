import { CommandOption } from "@/core/command/CommandOption";

export type OptionsMap = Record<string, CommandOption<unknown>>;

export type InferSchemaOutput<T extends OptionsMap> = {
  [K in keyof T]: T[K] extends CommandOption<infer U> ? U : never;
};

export class CommandOptionSchema<T extends OptionsMap> {
  constructor(private readonly optionsMap: T) {}

  public get options(): CommandOption<unknown>[] {
    return Object.values(this.optionsMap);
  }

  public parse(args: Record<string, unknown>): InferSchemaOutput<T> {
    const result: Record<string, unknown> = {};

    Object.entries(this.optionsMap).forEach(([key, option]) => {
      const rawValue = args[option.alias] as string | undefined;

      result[key] = option.tryParse(rawValue);
    });

    return result as InferSchemaOutput<T>;
  }
}
