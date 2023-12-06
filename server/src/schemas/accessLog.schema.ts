import { object, string, z } from "zod";

const params = {
  params: object({
    accessLogId: string({ required_error: "accessLogId is required" })
  })
}

export const deleteAccessLogSchema = object({
  ...params,
})

export type DeleteAccessLogSchema = z.infer<typeof deleteAccessLogSchema>
