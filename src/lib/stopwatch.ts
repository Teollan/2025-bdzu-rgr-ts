export interface Timed<T> {
  result: T;
  elapsed: number;
}

export interface WithExecutionTime {
  elapsed: number;
}

export const measureExecutionTime = async <T>(
  timedFn: () => Promise<T>
): Promise<Timed<T>> => {
  const start = Date.now();

  const result = await timedFn();

  const end = Date.now();

  const elapsed = end - start;

  return {
    result,
    elapsed,
  };
};

export const withExecutionTime = async <T>(
  fn: () => Promise<T[]>
): Promise<{ data: T[]; meta: WithExecutionTime }> => {
  const { result, elapsed } = await measureExecutionTime(fn);

  return {
    data: result,
    meta: { elapsed },
  };
};