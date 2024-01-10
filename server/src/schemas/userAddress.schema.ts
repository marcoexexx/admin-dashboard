import { boolean, object, string, z } from "zod";
import { Pagination } from "./types";


export type UserAddressFilterPagination = {
  filter?: any,
  pagination?: Pagination,
  include?: {
  }
  orderBy?: Record<
    keyof CreateUserAddressInput | "createdAt" | "updatedAt", 
    "asc" | "desc">
}

const params = {
  params: object({
    userAddressId: string({ required_error: "User Address id is required" })
  })
}

export const createUserAddressSchema = object({
  body: object({
    isDefault: boolean().default(false),
    username: string({ required_error: "Name (username) is required" }),
    phone: string({ required_error: "phone is required" }).min(9).max(12),
    email: string({ required_error: "email is required" }).email(),
    regionId: string({ required_error: "region is required" }),
    townshipFeesId: string({ required_error: "township is required" }),
    fullAddress: string({ required_error: "fullAddress is required" }).max(128),
  })
})

export const getUserAddressSchema = object({
  ...params,
})

export const updateUserAddressSchema = object({
  ...params,
  body: object({
    isDefault: boolean().default(false),
    username: string({ required_error: "Name (username) is required" }),
    phone: string({ required_error: "phone is required" }).min(9).max(12),
    email: string({ required_error: "email is required" }).email(),
    regionId: string({ required_error: "region is required" }),
    townshipFeesId: string({ required_error: "township is required" }),
    fullAddress: string({ required_error: "fullAddress is required" }).max(128),
  })
})

export const deleteMultiUserAddressesSchema = object({
  body: object({
    userAddressIds: string().array()
  })
})

export type CreateUserAddressInput = z.infer<typeof createUserAddressSchema>["body"]
export type DeleteMultiUserAddressesInput = z.infer<typeof deleteMultiUserAddressesSchema>["body"]
export type GetUserAddressInput = z.infer<typeof getUserAddressSchema>
export type UpdateUserAddressInput = z.infer<typeof updateUserAddressSchema>
