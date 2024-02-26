import { Pagination, SalesCategory, WhereInput } from "@/services/types"


export type SalesCategoryWhereInput = {
  where?: WhereInput<SalesCategory>,
  pagination?: Pagination,
  include?: {
    _count?: boolean,
    products?: boolean
  }
}


export interface SalesCategoryFilterActions {
  type: "SET_SALES_CATEGORY_FILTER",
  payload: SalesCategoryWhereInput
}

export interface ChangeSalesCategoryPageActions {
  type: "SET_SALES_CATEGORY_PAGE",
  payload: number
}

export interface ChangeSalesCategoryPageSizeActions {
  type: "SET_SALES_CATEGORY_PAGE_SIZE",
  payload: number
}
