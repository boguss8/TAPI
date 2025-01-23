export interface StringFilterInput {
  eq: string | null;
  contains: string | null;
  ne: string | null;
  notContains: string | null;
}

export interface NumberFilterInput {
  eq: number | null;
  gt: number | null;
  gte: number | null;
  lt: number | null;
  lte: number | null;
  ne: number | null;
}

export interface BooleanFilterInput {
  eq: boolean | null;
}

export interface DateFilterInput {
  eq: Date | null;
  gt: Date | null;
  gte: Date | null;
  lt: Date | null;
  lte: Date | null;
  ne: Date | null;
}

export type SortOrder = 'ASC' | 'DESC';

export interface SortInput<T> {
  field: keyof T;
  order: SortOrder;
}

export interface PaginationInput {
  limit: number;
  offset: number;
}
