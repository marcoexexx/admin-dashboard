import { CreatePotentialOrderInput, UpdatePotentialOrderInput } from "@/components/content/potential-orders/forms";
import { authApi } from "./authApi";
import { HttpListResponse, HttpResponse, Pagination, PotentialOrder, PotentialOrderResponse, QueryOptionArgs } from "./types";


export async function getPotentialOrdersFn(opt: QueryOptionArgs, { filter, pagination, include }: { filter: any, pagination: Pagination, include?: any }) {
  const { data } = await authApi.get<HttpListResponse<PotentialOrder>>("/potential-orders", {
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


export async function getPotentialOrderFn(opt: QueryOptionArgs, { potentialOrderId }: { potentialOrderId: string | undefined }) {
  if (!potentialOrderId) return
  const { data } = await authApi.get<PotentialOrderResponse>(`/potential-orders/detail/${potentialOrderId}`, {
    ...opt,
  })
  return data
}


export async function createPotentialOrderFn(potentialOrder: CreatePotentialOrderInput) {
  const { data } = await authApi.post<PotentialOrderResponse>("/potential-orders", potentialOrder)
  return data
}


export async function updatePotentialOrderFn({potentialOrderId, potentialOrder}: {potentialOrderId: string, potentialOrder: UpdatePotentialOrderInput}) {
  const { data } = await authApi.patch<PotentialOrderResponse>(`/potential-orders/detail/${potentialOrderId}`, potentialOrder)
  return data
}


export async function deleteMultiPotentialOrdersFn(potentialOrderIds: string[]) {
  const { data } = await authApi.delete<HttpResponse>("/potential-orders/multi", { data: { potentialOrderIds } })
  return data
}


export async function deletePotentialOrderFn(potentialOrderId: string) {
  const { data } = await authApi.delete<HttpResponse>(`/potential-orders/detail/${potentialOrderId}`)
  return data
}

