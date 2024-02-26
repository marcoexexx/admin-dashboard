import { Pagination, PickupAddress, WhereInput } from "@/services/types"


export type PickupAddressWhereInput = {
  where?: WhereInput<PickupAddress>,
  pagination?: Pagination,
  include?: {
    user?: boolean, 
    orders?: boolean, 
    potentialOrders?: boolean
  }
}

export interface PickupAddressFilterActions {
  type: "SET_PICKUP_ADDRESS_FILTER",
  payload: PickupAddressWhereInput
}

export interface ChangePickupPageActions {
  type: "SET_PICKUP_PAGE",
  payload: number
}

export interface ChangePickupPageSizeActions {
  type: "SET_PICKUP_PAGE_SIZE",
  payload: number
}
