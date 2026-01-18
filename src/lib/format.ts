const SQL_KEYWORDS = [
  'SELECT',
  'FROM',
  'WHERE',
  'AND',
  'OR',
  'JOIN',
  'INNER JOIN',
  'LEFT JOIN',
  'RIGHT JOIN',
  'CROSS JOIN',
  'ON',
  'GROUP BY',
  'HAVING',
  'ORDER BY',
  'LIMIT',
  'OFFSET',
  'INSERT INTO',
  'VALUES',
  'UPDATE',
  'SET',
  'DELETE',
  'RETURNING',
  'WITH',
  'AS',
  'UNION',
  'EXCEPT',
  'INTERSECT',
];

export const formatSql = (sql: string): string => {
  let formatted = sql
    .replace(/\s+/g, ' ')
    .trim();

  for (const keyword of SQL_KEYWORDS) {
    const regex = new RegExp(`\\b(${keyword})\\b`, 'gi');

    formatted = formatted.replace(regex, '\n$1');
  }

  return formatted
    .split('\n')
    .map((line) => line.trim())
    .filter(Boolean)
    .join('\n');
};
