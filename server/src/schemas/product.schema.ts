import { PriceUnit, ProductStatus, ProductStockStatus } from "@prisma/client";
import { boolean, number, object, string, z } from "zod";


const params = {
  params: object({
    productId: string()
  })
}

export const getProductSchema = object({
  ...params
})

export const getProductSaleCategorySchema = object({
  params: object({
    productId: string(),
    productSaleCategoryId: string()
  })
})


// TODO: Remove
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
    overview: string().max(5000).optional(),
    description: string().max(5000).optional(),
    categories: string().array().default([]),
    instockStatus: z.nativeEnum(ProductStockStatus).default(ProductStockStatus.AskForStock),
    dealerPrice: number().min(0).optional(),
    marketPrice: number().min(0).optional(),
    priceUnit: z.nativeEnum(PriceUnit),
    discount: number().max(100).default(0),
    isDiscountItem: boolean().default(false),
    /** Example: How salesCategory work
     * sale: { name: "11.11", startDate, endDate, isActivate }
     * product,
     **/
    salesCategory: object({
      salesCategory: string(), // by id
      discount: number().max(100).default(0)
    }).array(),
    quantity: number().min(0),
    status: z.nativeEnum(ProductStatus).default(ProductStatus.Draft),

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
    id: string().optional(),   //  id is optional because, dont known new product old product.
    price: number({ required_error: "Price is required "}),
    // TODO: change field name "brand.name"
    title: string({ required_error: "Title is required" })
      .min(1).max(128),
    specification: string().optional(),  //  by splitting "\n"
    overview: string().max(5000).optional(),
    description: string().max(5000).optional(),
    categories: string().optional(), // by splitting "\n"
    instockStatus: z.nativeEnum(ProductStockStatus).default(ProductStockStatus.AskForStock),
    dealerPrice: number().min(0).optional(),
    marketPrice: number().min(0).optional(),
    images: string(),
    priceUnit: z.nativeEnum(PriceUnit).default(PriceUnit.MMK),
    discount: number().max(100).default(0),
    isDiscountItem: boolean().default(false),
    quantity: number().min(0),
    status: z.nativeEnum(ProductStatus).default(ProductStatus.Draft),

    "brand.name": string({ required_error: "Brand is required" })
      .min(1).max(128),

    "sales.name": string().optional(),
    "sales.startDate": string().optional(),
    "sales.endDate": string().optional(),
    "sales.isActive": boolean().optional(),
    "sales.discount": number().optional(),
    "sales.description": string().optional(),

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
      .min(1).max(128)
      .min(1).max(128),
    title: string({ required_error: "Title is required" }),
    specification: object({
      name: string({ required_error: "Specification name is required" }),
      value: string({ required_error: "Specification value is required" }),
    }).array().default([]),
    discount: number().max(100).default(0),
    overview: string().min(0).max(5000).optional(),
    description: string().min(0).max(5000).optional(),
    categories: string().array().default([]),
    instockStatus: z.nativeEnum(ProductStockStatus).default(ProductStockStatus.AskForStock),
    dealerPrice: number().min(0).optional(),
    isDiscountItem: boolean().default(false),
    marketPrice: number().min(0).optional(),
    priceUnit: z.nativeEnum(PriceUnit).default(PriceUnit.MMK),
    status: z.nativeEnum(ProductStatus).default(ProductStatus.Draft),
    quantity: number().min(0),

    itemCode: string().nullable().optional(),
  })
})


export type GetProductInput = z.infer<typeof getProductSchema>["params"]
export type GetProductSaleCategoryInput = z.infer<typeof getProductSaleCategorySchema>
export type CreateProductInput = z.infer<typeof createProductSchema>["body"]
export type UpdateProductInput = z.infer<typeof updateProductSchema>
export type CreateMultiProductsInput = z.infer<typeof createMultiProductsSchema>["body"]
export type DeleteMultiProductsInput = z.infer<typeof deleteMultiProductsSchema>["body"]
export type UploadImagesProductInput = z.infer<typeof uploadImagesProductSchema>["body"]
export type LikeProductByUserInput = z.infer<typeof likeProductByUserSchema>
