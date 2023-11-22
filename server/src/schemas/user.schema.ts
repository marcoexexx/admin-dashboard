import { object, string, z } from "zod";
import { Pagination } from "./types";


export type Role = 
  | "Admin"
  | "User"
  | "Employee";


export type UserFilterPagination = {
  filter?: any,
  pagination?: Pagination
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

export const changeUserRoleSchema = object({
  ...params,
  body: object({
    role: z.enum(["Admin", "User", "Employee"], { required_error: "User role is required" })
  })
})


export type CreateUserInput = z.infer<typeof createUserSchema>["body"]
export type LoginUserInput = z.infer<typeof loginUserSchema>["body"]
export type GetUserInput = z.infer<typeof getUserSchema>["params"]
export type ChangeUserRoleInput = z.infer<typeof changeUserRoleSchema>["body"]
