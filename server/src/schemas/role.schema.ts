import { object, string, z } from "zod";

const params = {
  params: object({
    roleId: string({ required_error: "roleId is required" }),
  }),
};

export const createRoleSchema = object({
  body: object({
    name: string({ required_error: "Name is required" })
      .min(1).max(128),
    permissions: string().array().default([]),
  }),
});

export const createMultiRolesSchema = object({
  body: object({
    name: string({ required_error: "Name is required" })
      .min(1).max(128),
  }).array(),
});

export const getRoleSchema = object({
  ...params,
});

export const updateRoleSchema = object({
  ...params,
  body: object({
    name: string({ required_error: "Name is required" })
      .min(0).max(128),
    permissions: string().array().default([]),
  }),
});

export const deleteMultiRolesSchema = object({
  body: object({
    roleIds: string().array(),
  }),
});

export type CreateRoleInput = z.infer<typeof createRoleSchema>["body"];
export type CreateMultiRolesInput = z.infer<
  typeof createMultiRolesSchema
>["body"];
export type DeleteMultiRolesInput = z.infer<
  typeof deleteMultiRolesSchema
>["body"];
export type GetRoleInput = z.infer<typeof getRoleSchema>;
export type UpdateRoleInput = z.infer<typeof updateRoleSchema>;
