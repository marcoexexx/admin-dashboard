import { AuditLog, Pagination, WhereInput } from "@/services/types"


export type AuditLogWhereInput = {
  where?: WhereInput<AuditLog>,
  pagination?: Pagination
  include?: {
    user?: boolean
  }
}

export interface AuditLogFilterActions {
  type: "SET_AUDIT_LOG_FILTER",
  payload: AuditLogWhereInput
}

export interface ChangeAuditLogPageActions {
  type: "SET_AUDIT_LOG_PAGE",
  payload: number
}

export interface ChangeAuditLogPageSizeActions {
  type: "SET_AUDIT_LOG_PAGE_SIZE",
  payload: number
}
