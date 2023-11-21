import { object, string, z } from "zod";
import { FilterStringy, Pagination } from "./types";

export type Role = 
  | "Admin"
  | "User"
  | "Employee";

export interface IUser {
  id: string,
  firstName: string,
  lastName: string,
  username: string,
  email: string,
  password: string,
  role: Role,
  createdAt: Date,
  updatedAt: Date,
  // favorites?: IProduct[]
}

type UserFilter = {
  id?: string,
  firstName?: FilterStringy,
  lastName?: FilterStringy,
  username?: FilterStringy,
  email?: FilterStringy,
  role?: FilterStringy,
  // favorites?: ProductFilterPagination
}

export type UserFilterPagination = {
  filter?: UserFilter,
  pagination?: Pagination
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


export type CreateUserInput = z.infer<typeof createUserSchema>["body"]
export type LoginUserInput = z.infer<typeof loginUserSchema>["body"]
