import { Card } from "@mui/material";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useStore } from "@/hooks";
import { SuspenseLoader, queryClient } from "@/components";
import { deleteMultiPotentialOrdersFn, deletePotentialOrderFn, getPotentialOrdersFn } from "@/services/potentialOrdersApi";
import { PotentialOrdersListTable } from ".";


export function PotentialOrdersList() {
  const { state: {potentialOrderFilter}, dispatch } = useStore()

  const { data, isError, isLoading, error } = useQuery({
    queryKey: ["potential-orders", { filter: potentialOrderFilter } ],
    queryFn: args => getPotentialOrdersFn(args, { 
      filter: potentialOrderFilter?.fields,
      pagination: {
        page: potentialOrderFilter?.page || 1,
        pageSize: potentialOrderFilter?.limit || 10
      },
    }),
    select: data => data
  })

  const {
    mutate: deletePotentialOrder
  } = useMutation({
    mutationFn: deletePotentialOrderFn,
    onError(err: any) {
      dispatch({ type: "OPEN_TOAST", payload: {
        message: `failed: ${err.response.data.message}`,
        severity: "error"
      } })
    },
    onSuccess() {
      dispatch({ type: "OPEN_TOAST", payload: {
        message: "Success delete a potential order.",
        severity: "success"
      } })
      dispatch({ type: "CLOSE_ALL_MODAL_FORM" })
      queryClient.invalidateQueries({
        queryKey: ["potential-orders"]
      })
    }
  })

  const {
    mutate: deletePotentialOrders
  } = useMutation({
    mutationFn: deleteMultiPotentialOrdersFn,
    onError(err: any) {
      dispatch({ type: "OPEN_TOAST", payload: {
        message: `failed: ${err.response.data.message}`,
        severity: "error"
      } })
    },
    onSuccess() {
      dispatch({ type: "OPEN_TOAST", payload: {
        message: "Success delete multi brands.",
        severity: "success"
      } })
      dispatch({ type: "CLOSE_ALL_MODAL_FORM" })
      queryClient.invalidateQueries({
        queryKey: ["potential-orders"]
      })
    }
  })


  if (isError && error) return <h1>ERROR: {error.message}</h1>

  if (!data || isLoading) return <SuspenseLoader />

  function handleDeletePotentialOrder(id: string) {
    deletePotentialOrder(id)
  }

  function handleDeleteMultiPotentialOrders(ids: string[]) {
    deletePotentialOrders(ids)
  }

  return <Card>
    <PotentialOrdersListTable
      isLoading={isLoading}
      potentialOrders={data.results} 
      count={data.count} 
      onDelete={handleDeletePotentialOrder}
      onMultiDelete={handleDeleteMultiPotentialOrders}
    />
  </Card>
}
