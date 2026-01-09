import { Environment } from '@/core/environment';
import { PaginatedResult, PaginationParams } from './Repository.typedefs';
import { Repository } from '@/core/repository/Repository';

export function paginated<T, U extends Repository>(
  _target: U,
  _propertyKey: string,
  descriptor: TypedPropertyDescriptor<(params?: PaginationParams) => Promise<PaginatedResult<T>>>
) {
  const originalMethod = descriptor.value!;

  descriptor.value = async function (
    this: object,
    params: PaginationParams = {},
  ): Promise<PaginatedResult<T>> {
    const {
      limit = Environment.pageSize,
      offset = 0,
    } = params;

    const response = await originalMethod.call(this, {
      limit: limit + 1,
      offset,
    });

    const hasNextPage = response.items.length > limit;
    const hasPrevPage = offset > 0;

    const items = hasNextPage
      ? response.items.slice(0, limit)
      : response.items;

    const result: PaginatedResult<T> = {
      items,
      limit,
      offset,
    };

    if (hasNextPage) {
      const params = {
        limit,
        offset: offset + limit,
      };

      result.next = () => (
        descriptor.value!.call(this, params)
      );
    }

    if (hasPrevPage) {
      const params = {
        limit,
        offset: Math.max(0, offset - limit),
      };

      result.prev = () => (
        descriptor.value!.call(this, params)
      );
    }

    return result;
  };

  return descriptor;
}
