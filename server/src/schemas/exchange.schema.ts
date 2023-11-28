import { number, object, string, z } from "zod";
import { Pagination } from "./types";
import { PriceUnit } from "@prisma/client";

export type ExchangeFilterPagination = {
  filter?: any,
  pagination?: Pagination,
}

const params = {
  params: object({
    exchangeId: string({ required_error: "exchangeId is required" })
  })
}

export const createExchangeSchema = object({
  body: object({
    from: z.enum(["MMK", "USD", "SGD"]),
    to: z.enum(["MMK", "USD", "SGD"]),
    rate: number({ required_error: "MMK is required" })
      .min(1).max(128)
  })
})

export const getExchangeSchema = object({
  ...params
})

export type CreateExchangeInput = z.infer<typeof createExchangeSchema>["body"]
export type GetExchangeInput = z.infer<typeof getExchangeSchema>

