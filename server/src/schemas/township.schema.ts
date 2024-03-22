import { number, object, string, z } from "zod";

const params = {
  params: object({
    townshipId: string({ required_error: "township Id is required" }),
  }),
};

export const createTownshipSchema = object({
  body: object({
    name: string({ required_error: "name is required" }),
    fees: number({ required_error: "fees is required" }),
    regionId: string().optional(),
  }),
});

export const updateTownshipSchema = object({
  ...params,
  body: object({
    name: string({ required_error: "name is required" }),
    fees: number({ required_error: "fees is required" }),
    regionId: string().optional(),
  }),
});

export const createMultiTownshipsSchema = object({
  body: object({
    name: string({ required_error: "name is required" }),
    fees: number({ required_error: "fees is required" }),
  }).array(),
});

export const getTownshipSchema = object({
  ...params,
});

export const deleteMultiTownshipsSchema = object({
  body: object({
    townshipIds: string().array(),
  }),
});

export type GetTownshipInput = z.infer<typeof getTownshipSchema>;
export type CreateTownshipInput = z.infer<
  typeof createTownshipSchema
>["body"];
export type CreateMultiTownshipsInput = z.infer<
  typeof createMultiTownshipsSchema
>["body"];
export type DeleteMultiTownshipsInput = z.infer<
  typeof deleteMultiTownshipsSchema
>["body"];
export type UpdateTownshipInput = z.infer<typeof updateTownshipSchema>;
