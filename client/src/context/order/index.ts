export type OrderFilter = {
  fields?: any,
  page?: number,
  limit?: number,
  mode?: "insensitive" | "default",
  include?: any
}

export type PotentialOrderFilter = {
  fields?: any,
  page?: number,
  limit?: number,
  mode?: "insensitive" | "default"
  include?: {
    user?: boolean,
    orderItems?: {
      include?: {
        product?: boolean
      }
    } | boolean
  }
}
