import { boolean, object, string, z } from "zod";


const params = {
  params: object({
    userAddressId: string({ required_error: "User Address id is required" })
  })
}

export const createUserAddressSchema = object({
  body: object({
    isDefault: boolean().default(false),
    username: string({ required_error: "Name (username) is required" }),
    phone: string({ required_error: "phone is required" }).regex(/^(\+\d{1,2}\s?)?\(?\d{3}\)?[\s.-]?\d{3}[\s.-]?\d{4}$/),
    email: string({ required_error: "email is required" }).email(),
    regionId: string({ required_error: "region is required" }),
    townshipFeesId: string({ required_error: "township is required" }),
    fullAddress: string({ required_error: "fullAddress is required" }).max(128),
    remark: string().optional()
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
    phone: string({ required_error: "phone is required" }).regex(/^(\+\d{1,2}\s?)?\(?\d{3}\)?[\s.-]?\d{3}[\s.-]?\d{4}$/),
    email: string({ required_error: "email is required" }).email(),
    regionId: string({ required_error: "region is required" }),
    townshipFeesId: string({ required_error: "township is required" }),
    fullAddress: string({ required_error: "fullAddress is required" }).max(128),
    remark: string().optional()
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
