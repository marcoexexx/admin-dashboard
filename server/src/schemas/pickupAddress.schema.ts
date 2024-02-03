import { object, string, z } from "zod";


const params = {
  params: object({
    pickupAddressId: string({ required_error: "Pickup Address id is required" })
  })
}

export const getPickupAddressSchema = object({
  ...params,
})

export const deleteMultiPickupAddressesSchema = object({
  body: object({
    pickupAddressIds: string().array()
  })
})


export type DeleteMultiPickupAddressesInput = z.infer<typeof deleteMultiPickupAddressesSchema>["body"]
export type GetPickupAddressInput = z.infer<typeof getPickupAddressSchema>

