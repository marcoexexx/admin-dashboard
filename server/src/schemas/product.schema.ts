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
    reviews?: boolean,
  },
  orderBy?: Record<
    keyof CreateProductInput | "createdAt" | "updatedAt", 
    "asc" | "desc">
}

const params = {
  params: object({
    productId: string()
  })
}

export const getProductSchema = object({
  ...params
})


export const likeProductByUserSchema = object({
  ...params,
  body: object({
    userId: string()
  })
})

export const createProductSchema = object({
  body: object({
    price: number({ required_error: "Price is required "}),
    brandId: string({ required_error: "Brand is required" })
      .min(2).max(128),
    title: string({ required_error: "Brand is required" })
      .min(2).max(128),
    specification: object({
      name: string({ required_error: "Specification name is required" }),
      value: string({ required_error: "Specification value is required" }),
    }).array(),
    overview: string({ required_error: "Brand is required" })
      .min(2).max(5000),
    features: string({ required_error: "Brand is required" })
      .min(2).max(5000),
    warranty: number({ required_error: "Price is required "}),
    categories: string().array().default([]),
    colors: string({ required_error: "Color is required" })
      .min(2).max(128),
    instockStatus: z.enum(["InStock", "OutOfStock", "AskForStock"]),
    description: string({ required_error: "Description is required" })
      .min(2).max(5000),
    type: z.enum(["Switch", "Accessory", "Router", "Wifi"]).optional(),
    dealerPrice: number().min(0),
    marketPrice: number().min(0),
    discount: number().min(0),
    priceUnit: z.enum(["MMK", "USD", "SGD", "THB", "KRW"]),
    salesCategory: string().array(),
    quantity: number().min(0),
    status: z.enum(["Draft", "Pending", "Published"]).default("Draft")
  })
})


export const createMultiProductsSchema = object({
  body: object({
    id: string({ required_error: "productId is required" }),
    price: number({ required_error: "Price is required "}),
    brandName: string({ required_error: "Brand is required" })
      .min(1).max(128),
    title: string({ required_error: "Brand is required" })
      .min(1).max(128),
    specification: string({ required_error: "Specifications name are required "}),  //  by splitting "\n"
    overview: string({ required_error: "Brand is required" })
      .min(1).max(5000),
    features: string({ required_error: "Brand is required" })
      .min(1).max(5000),
    warranty: number({ required_error: "Price is required "}),
    categories: string({ required_error: "Categories name are required "}), // by splitting "\n"
    colors: string({ required_error: "Color is required" })
      .min(1).max(128),
    instockStatus: z.enum(["InStock", "OutOfStock", "AskForStock"]),
    description: string({ required_error: "Description is required" })
      .min(1).max(5000),
    type: z.enum(["Switch", "Accessory", "Router", "Wifi"]).optional(),
    dealerPrice: number().min(0),
    marketPrice: number().min(0),
    discount: number().min(0),
    priceUnit: z.enum(["MMK", "USD", "SGD", "THB", "KRW"]),
    salesCategory: string({ required_error: "Sales and categories name are required"}),  // by splitting "\n"
    quantity: number().min(0),
    status: z.enum(["Draft", "Pending", "Published"]).default("Draft")
  }).array()
})


export const uploadImagesProductSchema = object({
  body: object({
    images: string().array(),
  })
})


export const updateProductSchema = object({
  ...params,
  body: object({
    price: number({ required_error: "Price is required "}),
    brandId: string({ required_error: "Brand is required" })
      .min(2).max(128),
    title: string({ required_error: "Brand is required" })
      .min(2).max(128),
    specification: object({
      name: string({ required_error: "Specification name is required" }),
      value: string({ required_error: "Specification value is required" }),
    }).array(),
    overview: string({ required_error: "Brand is required" })
      .min(2).max(5000),
    features: string({ required_error: "Brand is required" })
      .min(2).max(5000),
    warranty: number({ required_error: "Price is required "}),
    categories: string().array().default([]),
    colors: string({ required_error: "Color is required" })
      .min(2).max(128),
    instockStatus: z.enum(["InStock", "OutOfStock", "AskForStock"]),
    description: string({ required_error: "Description is required" })
      .min(2).max(5000),
    type: z.enum(["Switch", "Accessory", "Router", "Wifi"]),
    dealerPrice: number().min(0),
    marketPrice: number().min(0),
    discount: number().min(0),
    priceUnit: z.enum(["MMK", "USD", "SGD", "THB", "KRW"]),  // enum
    salesCategory: string().array(),
    quantity: number().min(0),
    status: z.enum(["Draft", "Pending", "Published"]).default("Draft")
  })
})


export type GetProductInput = z.infer<typeof getProductSchema>["params"]
export type CreateProductInput = z.infer<typeof createProductSchema>["body"]
export type UpdateProductInput = z.infer<typeof updateProductSchema>
export type CreateMultiProductsInput = z.infer<typeof createMultiProductsSchema>["body"]
export type UploadImagesProductInput = z.infer<typeof uploadImagesProductSchema>["body"]
export type LikeProductByUserInput = z.infer<typeof likeProductByUserSchema>
