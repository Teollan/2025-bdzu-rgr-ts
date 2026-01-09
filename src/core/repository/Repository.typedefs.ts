export interface PaginationParams {
  limit?: number;
  offset?: number;
}

export interface PaginatedResult<T> {
  items: T[];
  limit: number;
  offset: number;
  next?: () => Promise<PaginatedResult<T>>;
  prev?: () => Promise<PaginatedResult<T>>;
}