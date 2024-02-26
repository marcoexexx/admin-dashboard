import { Pagination, Region, WhereInput } from "@/services/types"


export type RegionWhereInput = {
  where?: WhereInput<Region>,
  pagination?: Pagination,
  include?: {
    _count?: boolean,
    townships?: boolean, 
    userAddresses?: boolean
  }
}


export interface RegionFilterActions {
  type: "SET_REGION_FILTER",
  payload: RegionWhereInput
}

export interface ChangeRegionPageActions {
  type: "SET_REGION_PAGE",
  payload: number
}

export interface ChangeRegionPageSizeActions {
  type: "SET_REGION_PAGE_SIZE",
  payload: number
}
