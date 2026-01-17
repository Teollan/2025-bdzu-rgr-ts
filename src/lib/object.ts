import { truthy } from '@/lib/functional';

export const takeTruthy = <T extends Record<string, unknown>>(item: T): Partial<T> => {
  const entries = Object.entries(item);

  const truthyEntries = entries
    .filter(([_, value]) => truthy(value)) as [string, unknown][];

  return Object.fromEntries(truthyEntries) as Partial<T>;
};

export const isEmpty = <T extends Record<string, unknown>>(item: T): boolean => {
  return Object.keys(item).length === 0;
}