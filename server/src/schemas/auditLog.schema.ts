import { object, string, z } from "zod";
import { Pagination } from "./types";


export type AuditLogFilterPagination = {
  filter?: any,
  pagination?: Pagination,
  include?: {
    _count?: boolean
    user?: boolean
  }
}

const params = {
  params: object({
    auditLogId: string({ required_error: "accessLogId is required" })
  })
}

export const deleteAuditLogSchema = object({
  ...params,
})

export type DeleteAuditLogSchema = z.infer<typeof deleteAuditLogSchema>
