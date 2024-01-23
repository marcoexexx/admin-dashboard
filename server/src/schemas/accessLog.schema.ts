import { object, string, z } from "zod";
import { Pagination } from "./types";

export type AccessLogFilterPagination = {
  filter?: any,
  pagination?: Pagination,
  include?: {
    _count?: boolean
    user?: boolean
  }
}

const params = {
  params: object({
    accessLogId: string({ required_error: "accessLogId is required" })
  })
}

export const getAccessLogSchema = object({
  ...params,
})

export const deleteAccessLogSchema = object({
  ...params,
})

export type GetAccessLogSchema = z.infer<typeof getAccessLogSchema>
export type DeleteAccessLogSchema = z.infer<typeof deleteAccessLogSchema>
