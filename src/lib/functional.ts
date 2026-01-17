export const truthy = <T>(value: T | undefined | null): value is T => {
  return Boolean(value);
}