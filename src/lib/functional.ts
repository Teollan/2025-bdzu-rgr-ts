export const defined = <T>(item: T | undefined): item is T => {
  return item !== undefined;
};

export const truthy = <T>(item: T | null | undefined): item is T => {
  return Boolean(item);
}