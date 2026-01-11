import { Environment } from '@/core/environment';

export interface PaginationParams {
  limit: number;
  offset: number;
}

export interface Paginated<T> {
  items: T[];
  limit: number;
  offset: number;
  next?: () => Promise<Paginated<T>>;
  prev?: () => Promise<Paginated<T>>;
}

export function paginate<T>(
  fetchPage: (pagination: PaginationParams) => Promise<T[]>,
  pageSize: number = Environment.pageSize,
): Promise<Paginated<T>> {
  const getPaginated = async (offset: number): Promise<Paginated<T>> => {
    const page = await fetchPage({ limit: pageSize + 1, offset });

    const result: Paginated<T> = {
      items: page.slice(0, pageSize),
      limit: pageSize,
      offset,
    }

    const hasNextPage = page.length > pageSize;
    const hasPrevPage = offset > 0;

    if (hasNextPage) {
      result.next = () => getPaginated(offset + pageSize);
    }

    if (hasPrevPage) {
      result.prev = () => getPaginated(Math.max(0, offset - pageSize));
    }

    return result;
  };

  return getPaginated(0);
}

export function pseudoPaginate<T>(
  fetchAll: () => Promise<T[]>,
  pageSize: number = Environment.pageSize,
): Promise<Paginated<T>> {
  let cache: T[] | null = null;

  return paginate(async ({ offset, limit }) => {
    if (!cache) {
      cache = await fetchAll();
    }

    return cache.slice(offset, offset + limit);
  }, pageSize);
}
