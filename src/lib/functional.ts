export const defined = <T>(item: T | undefined): item is T => {
  return item !== undefined;
};