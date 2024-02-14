export type SalesCategoryFilter = {
  fields?: any,
  page?: number,
  limit?: number,
  mode?: "insensitive" | "default"
  include?: {
    _count?: boolean
  }
}
