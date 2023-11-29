import { Card } from "@mui/material";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useStore } from "@/hooks";
import { SuspenseLoader, queryClient } from "@/components";
import { createMultiExchangesFn, deleteExchangeFn, getExchangesFn } from "@/services/exchangesApi";
import { CreateExchangeInput } from "./forms";
import { ExchangesListTable } from ".";

export function ExchangesList() {
  const { state: {exchangeFilter}, dispatch } = useStore()

  const { data, isError, isLoading, error } = useQuery({
    queryKey: ["exchanges", { filter: exchangeFilter } ],
    queryFn: args => getExchangesFn(args, { 
      filter: exchangeFilter?.fields,
      pagination: {
        page: exchangeFilter?.page || 1,
        pageSize: exchangeFilter?.limit || 10
      },
    }),
    select: data => data
  })

  const {
    mutate: createExchanges
  } = useMutation({
    mutationFn: createMultiExchangesFn,
    onError(err: any) {
      dispatch({ type: "OPEN_TOAST", payload: {
        message: `failed: ${err.response.data.message}`,
        severity: "error"
      } })
    },
    onSuccess() {
      dispatch({ type: "OPEN_TOAST", payload: {
        message: "Success created new exchange.",
        severity: "success"
      } })
      dispatch({ type: "CLOSE_ALL_MODAL_FORM" })
      queryClient.invalidateQueries({
        queryKey: ["exchanges"]
      })
    }
  })

  const {
    mutate: deleteExchange
  } = useMutation({
    mutationFn: deleteExchangeFn,
    onError(err: any) {
      dispatch({ type: "OPEN_TOAST", payload: {
        message: `failed: ${err.response.data.message}`,
        severity: "error"
      } })
    },
    onSuccess() {
      dispatch({ type: "OPEN_TOAST", payload: {
        message: "Success delete a exchange.",
        severity: "success"
      } })
      dispatch({ type: "CLOSE_ALL_MODAL_FORM" })
      queryClient.invalidateQueries({
        queryKey: ["exchanges"]
      })
    }
  })

  if (!data && isError || error) return <h1>ERROR: {JSON.stringify(error)}</h1>

  if (!data || isLoading) return <SuspenseLoader />

  function handleCreateManyExchanges(data: CreateExchangeInput[]) {
    createExchanges(data)
  }

  function handleDeleteExchange(id: string) {
    deleteExchange(id)
  }

  return <Card>
    <ExchangesListTable
      exchanges={data.results} 
      count={data.count} 
      onCreateManyExchanges={handleCreateManyExchanges} 
      onDelete={handleDeleteExchange}
    />
  </Card>
}
