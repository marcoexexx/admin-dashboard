import { Permission, Pagination, WhereInput } from "@/services/types"


export type PermissionWhereInput = {
  where?: WhereInput<Permission>,
  pagination?: Pagination,
  include?: {
    role?: boolean
  }
}

export interface PermissionFilterActions {
  type: "SET_PERMISSION_FILTER",
  payload: PermissionWhereInput
}

export interface ChangePermissionPageActions {
  type: "SET_PERMISSION_PAGE",
  payload: number
}

export interface ChangePermissionPageSizeActions {
  type: "SET_PERMISSION_PAGE_SIZE",
  payload: number
}

