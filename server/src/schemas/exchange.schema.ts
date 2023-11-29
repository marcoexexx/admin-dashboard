import { number, object, string, z } from "zod";
import { Pagination } from "./types";

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
    from: z.enum(["MMK", "USD", "SGD", "THB", "KRW"]),
    to: z.enum(["MMK", "USD", "SGD", "THB", "KRW"]),
    rate: number({ required_error: "rate is required" })
      .min(1).max(128),
    date: string({ required_error: "Date field is required" })
  })
})

export const getExchangeSchema = object({
  ...params
})

export type CreateExchangeInput = z.infer<typeof createExchangeSchema>["body"]
export type GetExchangeInput = z.infer<typeof getExchangeSchema>

