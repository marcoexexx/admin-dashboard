import { CreateUserAddressInput, UpdateUserAddressInput } from "@/components/content/user-addresses/forms";
import { authApi } from "./authApi";
import { Address, HttpListResponse, HttpResponse, QueryOptionArgs, UserAddressResponse } from "./types";


export async function getUserAddressesFn(opt: QueryOptionArgs, { filter, pagination, include }: { filter: any, pagination: any, include?: any }) {
  const { data } = await authApi.get<HttpListResponse<Address>>("/addresses", {
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


export async function getUserAddressFn(opt: QueryOptionArgs, { userAddressId }: { userAddressId: string | undefined }) {
  if (!userAddressId) return
  const { data } = await authApi.get<UserAddressResponse>(`/addresses/detail/${userAddressId}`, {
    ...opt,
  })
  return data
}


export async function createUserAddressFn(address: CreateUserAddressInput) {
  const { data } = await authApi.post<UserAddressResponse>("/addresses", address)
  return data
}


export async function updateUserAddressFn({userAddressId, address}: {userAddressId: string, address: UpdateUserAddressInput}) {
  const { data } = await authApi.patch<UserAddressResponse>(`/addresses/detail/${userAddressId}`, address)
  return data
}


export async function deleteMultiUserAddressesFn(userAddressIds: string[]) {
  const { data } = await authApi.delete<UserAddressResponse>("/addresses/multi", { data: { userAddressIds } })
  return data
}


export async function deleteUserAddressFn(userAddressId: string) {
  const { data } = await authApi.delete<HttpResponse>(`/addresses/detail/${userAddressId}`)
  return data
}
