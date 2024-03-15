import { object, string, z } from "zod";

const params = {
  params: object({
    pickupAddressId: string({ required_error: "Pickup Address id is required" }),
  }),
};

export const getPickupAddressSchema = object({
  ...params,
});

export const createPickupAddressSchema = object({
  body: object({
    username: string({ required_error: "Username is required." }).min(1).max(1024),
    phone: string({ required_error: "phone is required" }).regex(
      /^(\+\d{1,2}\s?)?\(?\d{3}\)?[\s.-]?\d{3}[\s.-]?\d{4}$/,
    ),
    email: string({ required_error: "email is required" }).email(),
    date: string({ required_error: "Date field is required" }),
  }),
});

export const updatePickupAddressSchema = object({
  ...params,
  body: object({
    username: string({ required_error: "Username is required." }).min(1).max(1024),
    phone: string({ required_error: "phone is required" }).regex(
      /^(\+\d{1,2}\s?)?\(?\d{3}\)?[\s.-]?\d{3}[\s.-]?\d{4}$/,
    ),
    email: string({ required_error: "email is required" }).email(),
    date: string({ required_error: "Date field is required" }),
  }),
});

export const deleteMultiPickupAddressesSchema = object({
  body: object({
    pickupAddressIds: string().array(),
  }),
});

export type DeleteMultiPickupAddressesInput = z.infer<typeof deleteMultiPickupAddressesSchema>["body"];
export type GetPickupAddressInput = z.infer<typeof getPickupAddressSchema>;
export type CreatePickupAddressInput = z.infer<typeof createPickupAddressSchema>["body"];
