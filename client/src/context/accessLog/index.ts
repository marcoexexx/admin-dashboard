import { AccessLog, Pagination, WhereInput } from "@/services/types"


export type AccessLogWhereInput = {
  where?: WhereInput<AccessLog>,
  pagination?: Pagination
  include?: {
    user?: boolean
  }
}

export interface AccessLogFilterActions {
  type: "SET_ACCESS_LOG_FILTER",
  payload: AccessLogWhereInput
}

export interface ChangeAccessLogPageActions {
  type: "SET_ACCESS_LOG_PAGE",
  payload: number
}

export interface ChangeAccessLogPageSizeActions {
  type: "SET_ACCESS_LOG_PAGE_SIZE",
  payload: number
}
