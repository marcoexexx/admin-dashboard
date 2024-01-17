import { Card } from "@mui/material";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useStore } from "@/hooks";
import { SuspenseLoader, queryClient } from "@/components";
import { OrdersListTable } from ".";
import { playSoundEffect } from "@/libs/playSound";
import { deleteMultiOrdersFn, deleteOrderFn, getOrdersFn } from "@/services/orderApi";


export function OrdersList() {
  const { state: {orderFilter}, dispatch } = useStore()

  const { data, isError, isLoading, error } = useQuery({
    queryKey: ["orders", { filter: orderFilter } ],
    queryFn: args => getOrdersFn(args, { 
      filter: orderFilter?.fields,
      pagination: {
        page: orderFilter?.page || 1,
        pageSize: orderFilter?.limit || 10
      },
      include: {
        user: true,
        orderItems: true
      }
    }),
    select: data => data
  })

  const {
    mutate: deleteOrder
  } = useMutation({
    mutationFn: deleteOrderFn,
    onError(err: any) {
      dispatch({ type: "OPEN_TOAST", payload: {
        message: `failed: ${err.response.data.message}`,
        severity: "error"
      } })
      playSoundEffect("error")
    },
    onSuccess() {
      dispatch({ type: "OPEN_TOAST", payload: {
        message: "Success delete a potential order.",
        severity: "success"
      } })
      dispatch({ type: "CLOSE_ALL_MODAL_FORM" })
      queryClient.invalidateQueries({
        queryKey: ["orders"]
      })
      playSoundEffect("success")
    }
  })

  const {
    mutate: deleteOrders
  } = useMutation({
    mutationFn: deleteMultiOrdersFn,
    onError(err: any) {
      dispatch({ type: "OPEN_TOAST", payload: {
        message: `failed: ${err.response.data.message}`,
        severity: "error"
      } })
      playSoundEffect("error")
    },
    onSuccess() {
      dispatch({ type: "OPEN_TOAST", payload: {
        message: "Success delete multi brands.",
        severity: "success"
      } })
      dispatch({ type: "CLOSE_ALL_MODAL_FORM" })
      queryClient.invalidateQueries({
        queryKey: ["orders"]
      })
      playSoundEffect("success")
    }
  })


  if (isError && error) return <h1>ERROR: {error.message}</h1>

  if (!data || isLoading) return <SuspenseLoader />

  function handleDeleteOrder(id: string) {
    deleteOrder(id)
  }

  function handleDeleteMultiOrders(ids: string[]) {
    deleteOrders(ids)
  }

  return <Card>
    <OrdersListTable
      isLoading={isLoading}
      orders={data.results} 
      count={data.count} 
      onDelete={handleDeleteOrder}
      onMultiDelete={handleDeleteMultiOrders}
    />
  </Card>
}
