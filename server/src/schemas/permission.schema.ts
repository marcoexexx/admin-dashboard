import { OperationAction, Resource } from "@prisma/client";
import { nativeEnum, object, string, z } from "zod";

const params = {
  params: object({
    permissionId: string({ required_error: "permissionId is required" }),
  }),
};

export const createPermissionSchema = object({
  body: object({
    action: nativeEnum(OperationAction, {
      required_error: "actin is required.",
    }),
    resource: nativeEnum(Resource, {
      required_error: "resource is required.",
    }),
  }),
});

export const createMultiPermissionsSchema = object({
  body: object({
    id: string({ required_error: "id is required." }),
    action: nativeEnum(OperationAction, {
      required_error: "actin is required.",
    }),
    resource: nativeEnum(Resource, {
      required_error: "resource is required.",
    }),
  }).array(),
});

export const getPermissionSchema = object({
  ...params,
});

export const updatePermissionSchema = object({
  ...params,
  body: object({
    action: nativeEnum(OperationAction, {
      required_error: "actin is required.",
    }),
    resource: nativeEnum(Resource, {
      required_error: "resource is required.",
    }),
  }),
});

export const deleteMultiPermissionsSchema = object({
  body: object({
    permissionIds: string().array(),
  }),
});

export type CreatePermissionInput = z.infer<
  typeof createPermissionSchema
>["body"];
export type CreateMultiPermissionsInput = z.infer<
  typeof createMultiPermissionsSchema
>["body"];
export type DeleteMultiPermissionsInput = z.infer<
  typeof deleteMultiPermissionsSchema
>["body"];
export type GetPermissionInput = z.infer<typeof getPermissionSchema>;
export type UpdatePermissionInput = z.infer<typeof updatePermissionSchema>;
