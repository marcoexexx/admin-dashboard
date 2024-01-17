import { CreateOrderInput, UpdateOrderInput } from "@/components/content/orders/forms";
import { authApi } from "./authApi";
import { HttpListResponse, HttpResponse, Order, OrderResponse, QueryOptionArgs } from "./types";


export async function getOrdersFn(opt: QueryOptionArgs, { filter, pagination, include }: { filter: any, pagination: any, include?: any }) {
  const { data } = await authApi.get<HttpListResponse<Order>>("/orders", {
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


export async function getOrderFn(opt: QueryOptionArgs, { orderId }: { orderId: string | undefined }) {
  if (!orderId) return
  const { data } = await authApi.get<OrderResponse>(`/orders/detail/${orderId}`, {
    ...opt,
  })
  return data
}


export async function createOrderFn(order: CreateOrderInput) {
  const { data } = await authApi.post<OrderResponse>("/orders", order)
  return data
}


export async function updateOrderFn({orderId, order}: {orderId: string, order: UpdateOrderInput}) {
  const { data } = await authApi.patch<OrderResponse>(`/orders/detail/${orderId}`, order)
  return data
}


export async function deleteMultiOrdersFn(orderIds: string[]) {
  const { data } = await authApi.delete<HttpResponse>("/orders/multi", { data: { orderIds } })
  return data
}


export async function deleteOrderFn(orderId: string) {
  const { data } = await authApi.delete<HttpResponse>(`/orders/detail/${orderId}`)
  return data
}


