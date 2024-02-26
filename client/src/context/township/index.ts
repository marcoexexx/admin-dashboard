import { Pagination, TownshipFees, WhereInput } from "@/services/types"


export type TownshipWhereInput = {
  where?: WhereInput<TownshipFees>,
  pagination?: Pagination,
  include?: {
    _count?: boolean
    userAddresses?: boolean, 
    region?: boolean
  }
}


export interface TownshipFilterActions {
  type: "SET_TOWNSHIP_FILTER",
  payload: TownshipWhereInput
}

export interface ChangeTownshipPageActions {
  type: "SET_TOWNSHIP_PAGE",
  payload: number
}

export interface ChangeTownshipPageSizeActions {
  type: "SET_TOWNSHIP_PAGE_SIZE",
  payload: number
}
