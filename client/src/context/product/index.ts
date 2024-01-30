export type ProductFilter = {
  fields?: any,
  page?: number,
  limit?: number,
  mode?: "insensitive" | "default",
  include?: {
    _count?: boolean
    likedUsers?: boolean,
    brand?: boolean,
    specification?: boolean,
    categories?: {
      include?: {
        category?: boolean,
        product?: boolean,
      }
    },
    salesCategory?: {
      include?: {
        salesCategory?: boolean,
        product?: boolean,
      }
    },
    reviews?: boolean,
    creator?: boolean
  }
}
