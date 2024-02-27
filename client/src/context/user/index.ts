import { Pagination, User, WhereInput } from "@/services/types"


export type UserWhereInput = {
  where?: WhereInput<User>,
  pagination?: Pagination,
  include?: {
    _count?: boolean,
    reviews?: boolean,
    potentialOrders?: boolean,
    orders?: boolean,
    reward?: boolean,
    addresses?: boolean,
    favorites?: boolean,
    accessLogs?: boolean,
    auditLogs?: boolean,
    createdProducts?: boolean,
    pickupAddresses?: {
      include: {
        orders: true
      }
    } | boolean,
    blockedUsers?: boolean
  }
}


export interface UserFilterActions {
  type: "SET_USER_FILTER",
  payload: UserWhereInput
}

export interface ChangeUserPageActions {
  type: "SET_USER_PAGE",
  payload: number
}

export interface ChangeUserPageSizeActions {
  type: "SET_USER_PAGE_SIZE",
  payload: number
}
