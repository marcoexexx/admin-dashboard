import { Category, Pagination, WhereInput } from "@/services/types"


export type CategoryWhereInput = {
  where?: WhereInput<Category>,
  pagination?: Pagination,
  include?: {
    _count?: boolean,
    products?: boolean
  }
}

export interface CategoryFilterActions {
  type: "SET_CATEGORY_FILTER",
  payload: CategoryWhereInput
}

export interface ChangeCategoryPageActions {
  type: "SET_CATEGORY_PAGE",
  payload: number
}

export interface ChangeCategoryPageSizeActions {
  type: "SET_CATEGORY_PAGE_SIZE",
  payload: number
}
