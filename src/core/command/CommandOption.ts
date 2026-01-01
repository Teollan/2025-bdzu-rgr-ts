export interface BaseCommandOptionConfig<T> {
  alias: string;
  description: string;
  isRequired?: boolean;
  defaultValue?: T;
}

export interface CommandOptionConfig<T> extends BaseCommandOptionConfig<T> {
  parseFn: (input: string) => T;
}

export class CommandOption<T> {
  public readonly alias: string;
  public readonly description: string;
  public readonly isRequired: boolean;
  public readonly defaultValue: T | null;
  public readonly parse: (input: string) => T;

  constructor({
    alias: name,
    description,
    isRequired,
    defaultValue,
    parseFn,
  }: CommandOptionConfig<T>) {
    this.alias = name;
    this.description = description;
    this.isRequired = isRequired ?? false;
    this.defaultValue = defaultValue ?? null;
    this.parse = parseFn;
  }

  public tryParse(input?: string | null): T | null {
    if (!input) {
      return this.defaultValue;
    }

    try {
      return this.parse(input);
    } catch (error) {
      throw new Error(
        `Failed to parse option "${this.alias}": ${(error as Error).message}`
      );
    }
  }

  public static string(config: BaseCommandOptionConfig<string>): CommandOption<string> {
    return new CommandOption<string>({
      ...config,
      parseFn: (input) => input,
    });
  }

  public static int(config: BaseCommandOptionConfig<number>): CommandOption<number> {
    return new CommandOption<number>({
      ...config,
      parseFn: (input) => {
        const parsed = Number.parseInt(input, 10);

        if (Number.isNaN(parsed)) {
          throw new Error(`Invalid integer value: ${input}`);
        }

        return parsed;
      },
    });
  }

  public static float(config: BaseCommandOptionConfig<number>): CommandOption<number> {
    return new CommandOption<number>({
      ...config,
      parseFn: (input) => {
        const parsed = Number.parseFloat(input);

        if (Number.isNaN(parsed)) {
          throw new Error(`Invalid float value: ${input}`);
        }

        return parsed;
      },
    });
  }

  public static boolean(config: BaseCommandOptionConfig<boolean>): CommandOption<boolean> {
    return new CommandOption<boolean>({
      ...config,
      parseFn: (input) => {
        const lowered = input.toLowerCase();

        if (lowered === "true" || lowered === "1") {
          return true;
        }

        if (lowered === "false" || lowered === "0") {
          return false;
        }

        throw new Error(`Invalid boolean value: ${input}`);
      },
    });
  }

  public static timestamp(config: BaseCommandOptionConfig<Date>): CommandOption<Date> {
    return new CommandOption<Date>({
      ...config,
      parseFn: (input) => {
        const parsed = new Date(input);

        if (isNaN(parsed.getTime())) {
          throw new Error(`Invalid date value: ${input}`);
        }

        return parsed;
      },
    });
  }

  public static enum<T extends Record<string, string | number>>(
    enumeration: T,
    config: BaseCommandOptionConfig<T[keyof T]>,
  ): CommandOption<T[keyof T]> {
    return new CommandOption<T[keyof T]>({
      ...config,
      parseFn: (input) => {
        const enumValues = Object.values(enumeration) as Array<T[keyof T]>;

        if (!enumValues.includes(input as T[keyof T])) {
          throw new Error(`Invalid enum value: ${input}`);
        }

        return input as T[keyof T];
      },
    });
  }
}