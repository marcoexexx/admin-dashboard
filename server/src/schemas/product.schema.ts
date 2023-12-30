import { number, object, string, z } from "zod";
import { Pagination } from "./types";


export const productStockStatus = ["Available", "OutOfStock", "AskForStock", "Discontinued"] as const
export const productStatus = ["Draft", "Pending", "Published"] as const
export const priceUnit = ["MMK", "USD", "SGD", "THB", "KRW"] as const


export type ProductFilterPagination = {
  filter?: any,
  pagination?: Pagination,
  include?: {
    likedUsers?: {
      include?: {
        user?: boolean
      }
    } | boolean,
    brand?: boolean,
    categories?: {
      include: {
        category?: boolean
      }
    } | boolean,
    salesCategory?: {
      include?: {
        salesCategory?: boolean
      }
    } | boolean,
    specification?: boolean,
    reviews?: boolean,
    creator?: boolean,
    coupons?: boolean,
    orderItem?: boolean,
    availableSets?: {
      include?: {
        productSet?: boolean,
        product?: boolean
      },
    } | boolean
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
    title: string({ required_error: "Title is required" })
      .min(1).max(128),
    specification: object({
      name: string({ required_error: "Specification name is required" }),
      value: string({ required_error: "Specification value is required" }),
    }).array(),
    overview: string({ required_error: "Overview is required" })
      .min(1).max(5000),
    categories: string().array().default([]),
    instockStatus: z.enum(productStockStatus).default("AskForStock"),
    description: string({ required_error: "Description is required" })
      .min(1).max(5000),
    dealerPrice: number().min(0),
    marketPrice: number().min(0),
    priceUnit: z.enum(priceUnit),
    /** Example: How salesCategory work
     * sale: { name: "11.11", startDate, endDate, isActivate }
     * product,
     * discount: 13  // by percent
     **/
    salesCategory: object({
      salesCategory: string(), // by id
      discount: number().max(100)
    }).array(),
    quantity: number().min(0),
    status: z.enum(productStatus).default("Draft"),

    itemCode: string().nullable().optional(),
  })
})


export const deleteMultiProductsSchema = object({
  body: object({
    productIds: string().array(),
  })
})


export const createMultiProductsSchema = object({
  body: object({
    id: string({ required_error: "productId is required" }),
    price: number({ required_error: "Price is required "}),
    brandName: string({ required_error: "Brand is required" })
      .min(1).max(128),
    title: string({ required_error: "Title is required" })
      .min(1).max(128),
    specification: string().optional(),  //  by splitting "\n"
    overview: string({ required_error: "Overview is required" })
      .min(1).max(5000),
    categories: string().optional(), // by splitting "\n"
    instockStatus: z.enum(productStockStatus).default("AskForStock"),
    description: string({ required_error: "Description is required" })
      .min(1).max(5000),
    dealerPrice: number().min(0),
    images: string(),
    marketPrice: number().min(0),
    priceUnit: z.enum(priceUnit).default("MMK"),
    /**
     * Currently not support!
     * salesCategory in create multi product with excel upload
     */
    // salesCategory: string().optional(),  // by splitting "\n"
    quantity: number().min(0),
    status: z.enum(productStatus).default("Draft"),

    itemCode: string().nullable().optional(),
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
      .min(1).max(128),
    title: string({ required_error: "Title is required" })
      .min(1).max(128),
    specification: object({
      name: string({ required_error: "Specification name is required" }),
      value: string({ required_error: "Specification value is required" }),
    }).array().default([]),
    overview: string({ required_error: "Overview is required" })
      .min(1).max(5000),
    categories: string().array().default([]),
    instockStatus: z.enum(productStockStatus).default("AskForStock"),
    description: string({ required_error: "Description is required" })
      .min(1).max(5000),
    dealerPrice: number().min(0),
    marketPrice: number().min(0),
    priceUnit: z.enum(priceUnit).default("MMK"),
    /** Example: How salesCategory work
     * sale: { name: "11.11", startDate, endDate, isActivate }
     * product,
     * discount: 13  // by percent
     **/
    salesCategory: object({
      salesCategory: string(), // by id
      discount: number().max(100)
    }).array(),
    quantity: number().min(0),
    status: z.enum(productStatus).default("Draft"),

    itemCode: string().nullable().optional(),
  })
})


export type ProductStockStatus = typeof productStockStatus[number]
export type ProductStatus = typeof productStatus[number]
export type PriceUnit = typeof priceUnit[number]

export type GetProductInput = z.infer<typeof getProductSchema>["params"]
export type CreateProductInput = z.infer<typeof createProductSchema>["body"]
export type UpdateProductInput = z.infer<typeof updateProductSchema>
export type CreateMultiProductsInput = z.infer<typeof createMultiProductsSchema>["body"]
export type DeleteMultiProductsInput = z.infer<typeof deleteMultiProductsSchema>["body"]
export type UploadImagesProductInput = z.infer<typeof uploadImagesProductSchema>["body"]
export type LikeProductByUserInput = z.infer<typeof likeProductByUserSchema>
