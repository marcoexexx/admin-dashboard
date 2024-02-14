import { authApi } from "./authApi";
import { HttpListResponse, HttpResponse, Pagination, PickupAddress, PickupAddressResponse, QueryOptionArgs } from "./types";
import { PickupAddressFilter } from "@/context/pickupAddress";
import { CreatePickupAddressInput, UpdatePickupAddressInput } from "@/components/content/pickupAddressHistory/forms";


export async function getPickupAddressesFn(opt: QueryOptionArgs, { filter, pagination, include }: { filter: PickupAddressFilter["fields"], pagination: Pagination, include?: PickupAddressFilter["include"] }) {
  const { data } = await authApi.get<HttpListResponse<PickupAddress>>("/pickup-addresses", {
    ...opt,
    params: {
      filter,
      pagination,
      orderBy: {
        updatedAt: "desc"
      },
      include
    },
  })
  return data
}


export async function getPickupAddressFn(opt: QueryOptionArgs, { pickupAddressId, include }: { pickupAddressId: string | undefined, include?: PickupAddressFilter["include"] }) {
  if (!pickupAddressId) return
  const { data } = await authApi.get<PickupAddressResponse>(`/pickup-addresses/detail/${pickupAddressId}?include[township]=true`, {
    ...opt,
    params: {
      include
    }
  })
  return data
}


export async function createPickupAddressFn(address: CreatePickupAddressInput) {
  const { data } = await authApi.post<PickupAddressResponse>("/pickup-addresses", address)
  return data
}


export async function updatePickupAddressFn({pickupAddressId, address}: {pickupAddressId: string, address: UpdatePickupAddressInput}) {
  const { data } = await authApi.patch<PickupAddressResponse>(`/pickup-addresses/detail/${pickupAddressId}`, address)
  return data
}


export async function deleteMultiPickupAddressesFn(userAddressIds: string[]) {
  const { data } = await authApi.delete<PickupAddressResponse>("/pickup-addresses/multi", { data: { userAddressIds } })
  return data
}


export async function deletePickupAddressFn(userAddressId: string) {
  const { data } = await authApi.delete<HttpResponse>(`/pickup-addresses/detail/${userAddressId}`)
  return data
}
