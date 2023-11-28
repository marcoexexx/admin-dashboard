import { number, object, string, z } from "zod";
import { Pagination } from "./types";


export type ProductFilterPagination = {
  filter?: any,
  pagination?: Pagination,
  include?: {
    likedUsers?: boolean,
    brand?: boolean,
    categories?: boolean,
    salesCategory?: boolean,
    reviews?: boolean
  }
}

const params = {
  params: object({
    productId: string()
  })
}

export const getProductSchema = object({
  ...params
})

export const createProductSchema = object({
  body: object({
    price: number({ required_error: "Price is required "}),
    brandId: string({ required_error: "Brand is required" })
      .min(2).max(128),
    title: string({ required_error: "Brand is required" })
      .min(2).max(128),
    specification: string({ required_error: "Brand is required" })
      .min(2).max(5000),
    overview: string({ required_error: "Brand is required" })
      .min(2).max(5000),
    features: string({ required_error: "Brand is required" })
      .min(2).max(5000),
    warranty: number({ required_error: "Price is required "}),
    categories: string().array().default([]),
    colors: string({ required_error: "Brand is required" })
      .min(2).max(128),
    instockStatus: z.enum(["InStock", "OutOfStock", "AskForStock"]),
    description: string({ required_error: "Brand is required" })
      .min(2).max(5000),
    type: z.enum(["Switch", "Accessory", "Router", "Wifi"]),
    dealerPrice: number().min(0),
    marketPrice: number().min(0),
    discount: number().min(0),
    priceUnit: z.enum(["MMK", "USD"]),
    salesCategory: string().array(),
    quantity: number().min(0),
  })
})


export const uploadImagesProductSchema = object({
  body: object({
    images: string().array(),
  })
})


export type GetProductInput = z.infer<typeof getProductSchema>["params"]
export type CreateProductInput = z.infer<typeof createProductSchema>["body"]
export type UploadImagesProductInput = z.infer<typeof uploadImagesProductSchema>["body"]
