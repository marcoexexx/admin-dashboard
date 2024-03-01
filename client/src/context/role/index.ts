import { Role, Pagination, WhereInput } from "@/services/types"


export type RoleWhereInput = {
  where?: WhereInput<Role>,
  pagination?: Pagination,
  include?: {
    _count?: boolean,
    permissions?: boolean
  }
}

export interface RoleFilterActions {
  type: "SET_ROLE_FILTER",
  payload: RoleWhereInput
}

export interface ChangeRolePageActions {
  type: "SET_ROLE_PAGE",
  payload: number
}

export interface ChangeRolePageSizeActions {
  type: "SET_ROLE_PAGE_SIZE",
  payload: number
}

