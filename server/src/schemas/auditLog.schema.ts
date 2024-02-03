import { object, string, z } from "zod";


const params = {
  params: object({
    auditLogId: string({ required_error: "accessLogId is required" })
  })
}

export const deleteAuditLogSchema = object({
  ...params,
})

export type DeleteAuditLogSchema = z.infer<typeof deleteAuditLogSchema>
