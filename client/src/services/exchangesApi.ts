import { CreateExchangeInput, DeleteExchangeInput } from "@/components/content/exchanges/forms";
import { authApi } from "./authApi";


export async function getExchangesFn(opt: QueryOptionArgs, { filter, pagination }: { filter: any, pagination: any }) {
  const { data } = await authApi.get<HttpListResponse<IExchange>>("/exchanges", {
    ...opt,
    params: {
      filter,
      pagination
    },
  })
  return data
}


export async function createExchangeFn(brand: CreateExchangeInput) {
  const { data } = await authApi.post<IExchange>("/exchanges", brand)
  return data
}


export async function createMultiExchangesFn(brand: CreateExchangeInput[]) {
  const { data } = await authApi.post<IExchange>("/exchanges/multi", brand)
  return data
}


export async function deleteMultiExchangesFn(brandIds: DeleteExchangeInput["exchangeId"][]) {
  await Promise.all(brandIds.map(id => authApi.delete<HttpResponse>(`/exchanges/detail/${id}`)))
  return null
}


export async function deleteExchangeFn(brandId: DeleteExchangeInput["exchangeId"]) {
  const { data } = await authApi.delete<HttpResponse>(`/exchanges/detail/${brandId}`)
  return data
}

