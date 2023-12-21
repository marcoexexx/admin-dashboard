// import { number, object, string, z } from "zod"

// export const baseStringFilter = object({
//   gt: string().optional(),
//   lt: string().optional(),
//   gte: string().optional(),
//   lte: string().optional(),
//   in: string().array().optional(),
//   not: string().optional(),
//   notin: string().array().optional(),
//   equals: string().optional(),
//   contains: string().optional(),
//   startsWith: string().optional(),
//   mode: z.enum(["default", "string"]).optional()
// })

// export const baseNumberFilter = object({
//   gt: number().optional(),
//   lt: number().optional(),
//   gte: number().optional(),
//   lte: number().optional(),
//   in: number().array().optional(),
//   not: number().optional(),
//   notin: number().array().optional(),
//   equals: number().optional(),
// })

export type Pagination = {
  page?: number,
  pageSize?: number
}
