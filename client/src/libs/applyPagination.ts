export function applyPagination<T>(rows: Array<T>, page: number, limit: number): Array<T> {
  return rows.slice(page * limit, page * limit + limit)
}
