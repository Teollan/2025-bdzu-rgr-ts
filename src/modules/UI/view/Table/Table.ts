type Extractor<T> = (item: T) => unknown;

export interface Columns<T> {
  [key: string]: Extractor<T>;
}

export class Table<T> {
  private columns: Columns<T>;
  private columnNames: string[];

  constructor(columns: Columns<T>) {
    this.columns = columns;
    this.columnNames = Object.keys(columns);
  }

  build(items: T[]): string {
    if (this.columnNames.length === 0) {
      return "";
    }

    const rows = [this.columnNames, ...items.map((item) => this.getRowContent(item))];
    const columnWidths = this.calculateColumnWidths(rows);

    const lines: string[] = [];
    const border = this.buildBorder(columnWidths);

    lines.push(border);
    lines.push(this.buildRow(this.columnNames, columnWidths));
    lines.push(border);

    for (const row of rows.slice(1)) {
      lines.push(this.buildRow(row, columnWidths));
    }

    lines.push(border);

    return lines.join("\n");
  }

  private buildBorder(columnWidths: number[]): string {
    const parts = columnWidths.map((width) => "-".repeat(width + 2));

    return `+${parts.join("+")}+`;
  }

  private buildRow(cells: string[], columnWidths: number[]): string {
    const parts = cells.map((cell, i) => ` ${cell.padEnd(columnWidths[i])} `);

    return `|${parts.join("|")}|`;
  }

  private getRowContent(item: T): string[] {
    return this.columnNames.map((column) => String(this.columns[column](item)));
  }

  private calculateColumnWidths(rows: string[][]): number[] {
    return this.columnNames.map((_, i) => Math.max(...rows.map((row) => row[i].length)));
  }
}

export class ColumnValueTable extends Table<[string, unknown]> {
  constructor() {
    super({
      column: (entry) => entry[0],
      value: (entry) => entry[1],
    });
  }
}
