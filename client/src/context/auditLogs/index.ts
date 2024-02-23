import { AuditLog } from "@/services/types"

export type AuditLogWhereInput = {
  fields?: Record<keyof AuditLog, any>,
  page?: number,
  limit?: number,
  mode?: "insensitive" | "default",
  include?: {
    user?: boolean
  }
}
