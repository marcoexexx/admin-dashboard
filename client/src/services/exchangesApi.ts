import { CreateExchangeInput, DeleteExchangeInput, UpdateExchangeInput } from "@/components/content/exchanges/forms";
import { authApi } from "./authApi";


export async function getExchangesFn(opt: QueryOptionArgs, { filter, pagination, orderBy }: { filter: any, pagination: any, orderBy: Partial<Record<keyof IExchange, "asc" | "desc">> }) {
  const { data } = await authApi.get<HttpListResponse<IExchange>>("/exchanges", {
    ...opt,
    params: {
      filter,
      pagination,
      orderBy
    },
  })
  return data
}


export async function getExchangeFn(opt: QueryOptionArgs, { exchangeId }: { exchangeId: string | undefined }) {
  if (!exchangeId) return
  const { data } = await authApi.get<ExchangeResponse>(`/exchanges/detail/${exchangeId}`, {
    ...opt,
  })
  return data
}


export async function createExchangeFn(exchange: CreateExchangeInput) {
  const { data } = await authApi.post<ExchangeResponse>("/exchanges", exchange)
  return data
}


export async function updateExchangeFn({ exchangeId, exchange }: {exchangeId: string, exchange: UpdateExchangeInput}) {
  const { data } = await authApi.patch<ExchangeResponse>(`/exchanges/detail/${exchangeId}`, exchange)
  return data
}


export async function createMultiExchangesFn(exchange: CreateExchangeInput[]) {
  const { data } = await authApi.post<HttpResponse>("/exchanges/multi", exchange)
  return data
}


export async function deleteMultiExchangesFn(exchangeIds: DeleteExchangeInput["exchangeId"][]) {
  const { data } = await authApi.delete<HttpResponse>("/exchanges/multi", { data: { exchangeIds } })
  return data
}


export async function deleteExchangeFn(exchangeId: DeleteExchangeInput["exchangeId"]) {
  const { data } = await authApi.delete<HttpResponse>(`/exchanges/detail/${exchangeId}`)
  return data
}

