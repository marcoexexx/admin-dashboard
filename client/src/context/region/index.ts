export type RegionFilter = {
  fields?: any,
  page?: number,
  limit?: number,
  mode?: "insensitive" | "default"
  include?: {
    townships?: boolean
  }
}

