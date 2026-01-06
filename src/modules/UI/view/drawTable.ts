export type Value = Date | string | number | boolean | null;

export type ColumnBlueprint<T> = [string, (item: T) => Value];

export function drawTable<T>(items: T[], blueprints: ColumnBlueprint<T>[]) {
  const namedColumns = blueprints.map(getNamedColumns(items));

  const names = namedColumns.map(([name]) => name);
  const columns = namedColumns.map(([, ...values]) => values);
  
  const widths = namedColumns.map(getColumnWidth);

  const rows = transpose(columns);

  drawBorder(widths);

  drawRow(widths)(names);
  
  drawBorder(widths);

  rows.forEach(drawRow(widths));

  drawBorder(widths);
}

function getNamedColumns<T>(items: T[]) {
  return ([name, extractor]: ColumnBlueprint<T>) => {
    const values = items.map((item) => String(extractor(item)));

    return [name, ...values.map(String)];
  }
} 

function transpose(matrix: string[][]): string[][] {
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