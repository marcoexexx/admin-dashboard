import { number, object, string, z } from "zod";


const params = {
  params: object({
    cartId: string({ required_error: "cartId is required" })
  })
}

export const initialCartSchema = object({
  body: object({
    label: string().optional(),
    orderItems: object({
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


export type InitialCartInput = z.infer<typeof initialCartSchema>["body"]
export type GetCartInput = z.infer<typeof getCartSchema>
