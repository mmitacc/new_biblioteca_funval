export interface PaginationResults<O> {
  data: O[];
  total: number;
  page: number;
  limit: number;
  totalPage: number;
}
