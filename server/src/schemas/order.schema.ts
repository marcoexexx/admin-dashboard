import { number, object, string, z } from "zod";
import { Pagination } from "./types";


export type OrderFilterPagination = {
  filter?: any,
  pagination?: Pagination,
  include?: {
  },
  orderBy?: Record<
    keyof CreateOrderInput | "createdAt" | "updatedAt", 
    "asc" | "desc">
}

const params = {
  params: object({
    orderId: string({ required_error: "Order Id is required" })
  })
}

const orderItem = object({
  price: number(),
  totalPrice: number(),
  quantity: number(),
  productId: string(),
})

export const createOrderSchema = object({
  body: object({
    orderItems: orderItem.array(),
  })
})

// WARN: Excel upload currently not support!

export const getOrderSchema = object({
  ...params
})

export const updateOrderSchema = object({
  ...params,
  body: object({
    orderItems: orderItem.array()
  })
})

export const deleteMultiOrdersSchema = object({
  body: object({
    orderIds: string().array()
  })
})


export type GetOrderInput = z.infer<typeof getOrderSchema>
export type CreateOrderInput = z.infer<typeof createOrderSchema>["body"]
// export type CreateMultiOrdersInput = z.infer<typeof createMultiOrdersSchema>["body"]
export type DeleteMultiOrdersInput = z.infer<typeof deleteMultiOrdersSchema>["body"]
export type UpdateOrderInput = z.infer<typeof updateOrderSchema>

