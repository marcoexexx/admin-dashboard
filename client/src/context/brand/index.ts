import { Brand } from "@/services/types"

export type BrandWhereInput = {
  fields?: Record<keyof Brand, any>,
  page?: number,
  limit?: number,
  mode?: "insensitive" | "default"
  include?: {
    _count?: boolean,
    products?: boolean
  }
}
