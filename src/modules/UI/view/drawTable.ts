export type Value = Date | string | number | boolean | null;

export type ColumnBlueprint<T> = [string, (item: T) => Value];

export function drawTable<T>(items: T[], blueprints: ColumnBlueprint<T>[]) {
  const names = blueprints.map(getColumnName);

  const columns = blueprints.map(getColumnValues(items));
  
  const widths = [names, ...columns].map(getColumnWidth);

  const rows = transpose(columns);

  drawBorder(widths);

  drawRow(widths)(names);
  
  drawBorder(widths);

  rows.forEach(drawRow(widths));
}

function getColumnName<T>(extractor: ColumnBlueprint<T>) {
  return extractor[0];
}

function getColumnValues<T>(items: T[]) {
  return ([_, extractor]: ColumnBlueprint<T>) => {
    return items.map((item) => String(extractor(item)));
  }
} 

function transpose<T>(matrix: T[][]): T[][] {
  return matrix[0].map((_, i) => matrix.map(row => row[i]));
}

function getColumnWidth(rows: string[]) {
  const widths = rows.map((row) => row.length);

  return Math.max(...widths);
}

function drawBorder(columnWidths: number[]) {
  const parts = columnWidths.map((width) => "-".repeat(width + 2));

  console.log(`+${parts.join("+")}+`);
}

function drawRow(columnWidths: number[]) {
  return (cells: string[]) => {
    const parts = cells.map((cell, i) => ` ${cell.padEnd(columnWidths[i])} `);

    console.log(`|${parts.join("|")}|`);
  }
}