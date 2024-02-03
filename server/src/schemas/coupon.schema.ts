import { boolean, number, object, string, z } from "zod";



const params = {
  params: object({
    couponId: string({ required_error: "Coupon id is required" })
  })
}

export const createCouponSchema = object({
  body: object({
    points: number({ required_error: "Points is required" })
      .min(0)
      .max(1_000),
    dolla: number({ required_error: "Dolla is required" })
      .min(0)
      .max(10),
    productId: string().optional(),
    isUsed: boolean().default(false),
    expiredDate: string({ required_error: "ExpiredDate is required" })
  })
})

export const createMultiCouponsSchema = object({
  body: object({
    points: number({ required_error: "Points is required" })
      .min(0)
      .max(1_000),
    dolla: number({ required_error: "Dolla is required" })
      .min(0)
      .max(10),
    productId: string().optional(),
    isUsed: boolean().default(false),
    label: string({ required_error: "Coupon label is required" }),
    // rewardId: string().optional(),  // for whose coupons
    expiredDate: string({ required_error: "ExpiredDate is required" })
  }).array()
})

export const getCouponSchema = object({
  ...params,
})

export const updateCouponSchema = object({
  ...params,
  body: object({
    points: number({ required_error: "Points is required" })
      .min(0)
      .max(1_000),
    dolla: number({ required_error: "Dolla is required" })
      .min(0)
      .max(10),
    productId: string().optional(),
    isUsed: boolean().default(false),
    rewardId: string().optional(),
    expiredDate: string({ required_error: "ExpiredDate is required" })
  })
})

export const deleteMultiCouponsSchema = object({
  body: object({
    couponIds: string().array()
  })
})


export type CreateCouponInput = z.infer<typeof createCouponSchema>["body"]
export type CreateMultiCouponsInput = z.infer<typeof createMultiCouponsSchema>["body"]
export type DeleteMultiCouponsInput = z.infer<typeof deleteMultiCouponsSchema>["body"]
export type GetCouponInput = z.infer<typeof getCouponSchema>
export type UpdateCouponInput = z.infer<typeof updateCouponSchema>
