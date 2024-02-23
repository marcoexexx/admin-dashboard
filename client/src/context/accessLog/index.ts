import { AccessLog } from "@/services/types"


export type AccessLogWhereInput = {
  fields?: Record<keyof AccessLog, any>,
  page?: number,
  limit?: number,
  mode?: "insensitive" | "default",
  include?: {
    user?: boolean
  }
}
