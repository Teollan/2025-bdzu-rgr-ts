import { Environment } from '@/core/environment';

export interface PaginationParams {
  limit: number;
  offset: number;
}

export type PaginationMiddleware<T, M> = (
  fn: () => Promise<T[]>
) => Promise<{ data: T[]; meta: M }>;

export interface PaginateOptions<T, M> {
  pageSize?: number;
  middleware?: PaginationMiddleware<T, M>;
}

export type Page<T, M = void> = {
  items: T[];
  limit: number;
  offset: number;
  next?: () => Promise<Page<T, M>>;
  prev?: () => Promise<Page<T, M>>;
} & (M extends void ? Record<string, never> : { meta: M });

export function paginate<T, M = void>(
  fetchPage: (pagination: PaginationParams) => Promise<T[]>,
  options: PaginateOptions<T, M> = {},
): Promise<Page<T, M>> {
  const {
    pageSize = Environment.pageSize,
    middleware,
  } = options;

  const getPaginated = async (offset: number): Promise<Page<T, M>> => {
    const { data, meta } = middleware
      ? await middleware(() => fetchPage({ limit: pageSize + 1, offset }))
      : { data: await fetchPage({ limit: pageSize + 1, offset }), meta: undefined };

    const result = {
      items: data.slice(0, pageSize),
      limit: pageSize,
      offset,
      ...(meta !== undefined && { meta }),
    } as Page<T, M>;

    const hasNextPage = data.length > pageSize;
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

export function paginateInMemory<T>(
  fetchAll: () => Promise<T[]>,
  pageSize: number = Environment.pageSize,
): Promise<Page<T>> {
  let cache: T[] | null = null;

  return paginate(async ({ offset, limit }) => {
    if (!cache) {
      cache = await fetchAll();
    }

    return cache.slice(offset, offset + limit);
  }, { pageSize });
}
