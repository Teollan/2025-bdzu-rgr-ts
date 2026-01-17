export type ColumnBlueprint<T> = (keyof T) | [string, keyof T] | [string, (item: T) => unknown];

interface TableOptions<T> {
  columns?: ColumnBlueprint<T>[];
}
interface ObjectOptions<T> {
  pick?: (keyof T)[];
}

export class InputOutput {
  public say = console.log;

  public error = console.error;

  public table<T>(
    items: T[],
    options: TableOptions<T> = {},
  ) {
    const {
      columns: blueprints = Object.keys(items.at(0) ?? {}) as ColumnBlueprint<T>[],
    } = options;

    const toNamedColumns = (blueprint: ColumnBlueprint<T>): string[] => {
      if (Array.isArray(blueprint)) {
        const [name, accessor] = blueprint;

        const values = items.map((item) => {
          if (typeof accessor === 'function') {
            return String(accessor(item));
          }

          return String(item[accessor]);
        });

        return [name, ...values];
      }

      const values = items.map((item) => String(item[blueprint]));

      return [String(blueprint), ...values.map(String)];
    };

    const toColumnWidth = (values: string[]) => {
      const widths = values.map((value) => value.length);

      return Math.max(...widths);
    }

    const transpose = (matrix: string[][]): string[][] => {
      return matrix[0].map((_, i) => matrix.map(row => row[i]));
    }

    const namedColumns = blueprints.map(toNamedColumns);

    const names = namedColumns.map(([name]) => name);

    const columns = namedColumns.map(([, ...values]) => values);

    const widths = namedColumns.map(toColumnWidth);

    const rows = transpose(columns);

    const drawBorder = () => {
      const parts = widths.map((width) => "-".repeat(width + 2));

      this.say(`+${parts.join("+")}+`);
    }

    const drawRow = (values: string[]) => {
      const parts = values.map((cell, i) => (
        ` ${cell.padEnd(widths[i])} `
      ));

      this.say(`|${parts.join("|")}|`);
    }

    drawBorder();

    drawRow(names);

    drawBorder();

    rows.forEach(drawRow);
    
    drawBorder();
  }

  public object<T extends Record<keyof T, unknown>>(
    instance: T,
    options: ObjectOptions<T> = {},
  ) {
    const { pick } = options;

    const entries = Object.entries(instance);

    const pickedEntries = pick
      ? entries.filter(([key]) => pick.includes(key as keyof T))
      : entries;

    this.table(pickedEntries, {
      columns: [
        ['Key', 0],
        ['Value', 1],
      ],
    });
  }
}