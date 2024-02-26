import { Brand, Pagination, WhereInput } from "@/services/types"


export type BrandWhereInput = {
  where?: WhereInput<Brand>,
  pagination?: Pagination,
  include?: {
    _count?: boolean,
    products?: boolean
  }
}

export interface BrandFilterActions {
  type: "SET_BRAND_FILTER",
  payload: BrandWhereInput
}

export interface ChangeBrandPageActions {
  type: "SET_BRAND_PAGE",
  payload: number
}

export interface ChangeBrandPageSizeActions {
  type: "SET_BRAND_PAGE_SIZE",
  payload: number
}
