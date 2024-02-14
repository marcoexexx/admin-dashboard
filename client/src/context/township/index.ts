export type TownshipFilter = {
  fields?: any,
  page?: number,
  limit?: number,
  mode?: "insensitive" | "default",
  include?: {
    region?: boolean
  }
}
