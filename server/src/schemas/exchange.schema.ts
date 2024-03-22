import { PriceUnit } from "@prisma/client";
import { number, object, string, z } from "zod";

const params = {
  params: object({
    exchangeId: string({ required_error: "exchangeId is required" }),
  }),
};

export const createExchangeSchema = object({
  body: object({
    from: z.nativeEnum(PriceUnit).default(PriceUnit.MMK),
    to: z.nativeEnum(PriceUnit).default(PriceUnit.USD),
    rate: number({ required_error: "rate is required" })
      .min(0),
    date: string({ required_error: "Date field is required" }),
    shopownerProviderId: string({
      required_error: "shopownerProviderId is required.",
    }),
  }).refine(data => data.from !== data.to, {
    path: ["to"],
    message: "to and from must different",
  }),
});

export const updateExchangeSchema = object({
  ...params,
  body: object({
    from: z.nativeEnum(PriceUnit).default(PriceUnit.MMK),
    to: z.nativeEnum(PriceUnit).default(PriceUnit.USD),
    rate: number({ required_error: "rate is required" })
      .min(0),
    date: string({ required_error: "Date field is required" }),
    shopownerProviderId: string({
      required_error: "shopownerProviderId is required.",
    }),
  }).refine(data => data.from !== data.to, {
    path: ["to"],
    message: "to and from must different",
  }),
});

export const createMultiExchangesSchema = object({
  body: object({
    id: string({ required_error: "Id is required" }),
    from: z.nativeEnum(PriceUnit).default(PriceUnit.MMK),
    to: z.nativeEnum(PriceUnit).default(PriceUnit.USD),
    rate: number({ required_error: "rate is required" })
      .min(0),
    date: string({ required_error: "Date field is required" }),

    "shopownerProvider.name": string({
      required_error: "shopownerProvider is required",
    }),
  }).refine(data => data.from !== data.to, {
    path: ["to"],
    message: "to and from must different",
  }).array(),
});

export const getExchangeSchema = object({
  ...params,
});

export const deleteMultiExchangesSchema = object({
  body: object({
    exchangeIds: string().array(),
  }),
});

export type CreateExchangeInput = z.infer<
  typeof createExchangeSchema
>["body"];
export type UpdateExchangeInput = z.infer<typeof updateExchangeSchema>;
export type CreateMultiExchangesInput = z.infer<
  typeof createMultiExchangesSchema
>["body"];
export type DeleteMultiExchangesInput = z.infer<
  typeof deleteMultiExchangesSchema
>["body"];
export type GetExchangeInput = z.infer<typeof getExchangeSchema>;
