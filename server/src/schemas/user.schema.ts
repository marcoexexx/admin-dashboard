import { object, string, z } from "zod";
import { Pagination } from "./types";


export const userRole = ["Admin", "User", "Shopowner"] as const


export type UserFilterPagination = {
  filter?: any,
  pagination?: Pagination,
  include?: any
}


const params = {
  params: object({
    userId: string({ required_error: "User ID is required" })
  })
}

export const createUserSchema = object({
  body: object({
    name: string({ required_error: "Username is required" })
      .min(1)
      .max(128),
    email: string({ required_error: "Email is required"})
      .email(),
    password: string({ required_error: "Password id required" })
      .min(8)
      .max(32),
    passwordConfirm: string({ required_error: "Please confirm your password" })
  }).refine(data => data.password === data.passwordConfirm, {
    path: ["passwordConfirm"],
    message: "Password do not match"
  })
})

export const loginUserSchema = object({
  body: object({
    email: string({ required_error: "Email is required"})
      .email(),
    password: string({ required_error: "Password id required" })
  })
})

export const getUserSchema = object({
  ...params
})

export const getUserByUsernameSchema = object({
  params: object({
    username: string({ required_error: "Username is required" })
  })
})

export const changeUserRoleSchema = object({
  ...params,
  body: object({
    role: z.enum(userRole).default("User")
  })
})

export const uploadImageProfileSchema = object({
  body: object({
    image: string({ required_error: "Image is required"}),
  })
})

export const veriffyEmailSchema = object({
  params: object({
    verificationCode: string()
  })
})


export type Role = typeof userRole[number]

export type CreateUserInput = z.infer<typeof createUserSchema>["body"]
export type LoginUserInput = z.infer<typeof loginUserSchema>["body"]
export type GetUserInput = z.infer<typeof getUserSchema>["params"]
export type GetUserByUsernameInput = z.infer<typeof getUserByUsernameSchema>["params"]
export type ChangeUserRoleInput = z.infer<typeof changeUserRoleSchema>["body"]
export type UploadImageUserInput = z.infer<typeof uploadImageProfileSchema>["body"]
export type VerificationEmailInput = z.infer<typeof veriffyEmailSchema>["params"]
