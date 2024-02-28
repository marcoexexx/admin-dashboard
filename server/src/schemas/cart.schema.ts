import { number, object, string, z } from "zod";


const params = {
  params: object({
    cartId: string({ required_error: "cartId is required" })
  })
}

export const initialCartSchema = object({
  body: object({
    orderItems: object({
      id: string().optional(),
      price: number(),
      quantity: number(),
      productId: string(),
      totalPrice: number().min(0),
      saving: number()
    }).array().min(0),
  })
})

export const getCartSchema = object({
  ...params,
})

export const deleteCartOrderItemSchema = object({
  params: object({
    orderItemId: string({ required_error: "orderItemId is required."})
  })
})


export type InitialCartInput = z.infer<typeof initialCartSchema>["body"]
export type GetCartInput = z.infer<typeof getCartSchema>
export type DeleteCartOrderItemInput = z.infer<typeof deleteCartOrderItemSchema>["params"]
