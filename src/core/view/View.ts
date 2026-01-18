export type ColumnBlueprint<T> = (keyof T) | [string, keyof T] | [string, (item: T) => unknown];

interface TableOptions<T extends Record<keyof T, unknown>> {
  columns?: ColumnBlueprint<T>[];
}

interface ObjectOptions<T extends Record<keyof T, unknown>> {
  pick?: (keyof T)[];
}

export abstract class View {
  public say = console.log;

  protected table<T extends Record<keyof T, unknown>>(
    items: T[],
    options: TableOptions<T> = {},
  ) {
    if (items.length === 0) {
      return;
    }

    const blueprints = options.columns ?? Object.keys(items[0]) as ColumnBlueprint<T>[];

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
    };

    const transpose = (matrix: string[][]): string[][] => {
      return matrix[0].map((_, i) => matrix.map(row => row[i]));
    };

    const namedColumns = blueprints.map(toNamedColumns);

    const names = namedColumns.map(([name]) => name);

    const columns = namedColumns.map(([, ...values]) => values);

    const widths = namedColumns.map(toColumnWidth);

    const rows = transpose(columns);

    const drawBorder = () => {
      const parts = widths.map((width) => "-".repeat(width + 2));

      this.say(`+${parts.join("+")}+`);
    };

    const drawRow = (values: string[]) => {
      const parts = values.map((cell, i) => (
        ` ${cell.padEnd(widths[i])} `
      ));

      this.say(`|${parts.join("|")}|`);
    };

    drawBorder();

    drawRow(names);

    drawBorder();

    rows.forEach(drawRow);

    drawBorder();
  }

  protected object<T extends Record<keyof T, unknown>>(
    item: T,
    options: ObjectOptions<T> = {},
  ) {
    const propsToPick = (options.pick ?? Object.keys(item)) as string[];

    const properties = Object.entries(item)
      .filter(([key]) => propsToPick.includes(key))
      .map(([key, value]) => ({ key, value }));

    this.table(properties, {
      columns: [
        ['Property', 'key'],
        ['Value', 'value'],
      ],
    });
  }
}

export type ViewConstructor<T extends View = View> = new () => T;
