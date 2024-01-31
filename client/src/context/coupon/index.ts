export type CouponFilter = {
  fields?: any,
  page?: number,
  limit?: number,
  mode?: "insensitive" | "default"
  include?: {
    _count?: boolean,
    product?: boolean
  }
}
