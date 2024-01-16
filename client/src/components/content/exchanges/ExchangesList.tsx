import { Card } from "@mui/material";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useStore } from "@/hooks";
import { SuspenseLoader, queryClient } from "@/components";
import { createMultiExchangesFn, deleteExchangeFn, deleteMultiExchangesFn, getExchangesFn } from "@/services/exchangesApi";
import { ExchangesListTable } from ".";
import { playSoundEffect } from "@/libs/playSound";


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
    mutate: createExchanges,
    isPending
  } = useMutation({
    mutationFn: createMultiExchangesFn,
    onError(err: any) {
      dispatch({ type: "OPEN_TOAST", payload: {
        message: `failed: ${err.response.data.message}`,
        severity: "error"
      } })
      playSoundEffect("error")
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
      playSoundEffect("success")
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
      playSoundEffect("error")
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
      playSoundEffect("success")
    }
  })

  const {
    mutate: deleteExchanges
  } = useMutation({
    mutationFn: deleteMultiExchangesFn,
    onError(err: any) {
      dispatch({ type: "OPEN_TOAST", payload: {
        message: `failed: ${err.response.data.message}`,
        severity: "error"
      } })
      playSoundEffect("error")
    },
    onSuccess() {
      dispatch({ type: "OPEN_TOAST", payload: {
        message: "Success delete exchanges.",
        severity: "success"
      } })
      dispatch({ type: "CLOSE_ALL_MODAL_FORM" })
      queryClient.invalidateQueries({
        queryKey: ["exchanges"]
      })
      playSoundEffect("success")
    }
  })

  if (isError && error) return <h1>ERROR: {JSON.stringify(error)}</h1>

  if (!data || isLoading) return <SuspenseLoader />

  function handleCreateManyExchanges(buf: ArrayBuffer) {
    createExchanges(buf)
  }

  function handleDeleteExchange(id: string) {
    deleteExchange(id)
  }

  function handleDeleteMultiExchanges(ids: string[]) {
    deleteExchanges(ids)
  }

  return <Card>
    <ExchangesListTable
      exchanges={data.results} 
      count={data.count} 
      isLoading={isPending}
      onCreateManyExchanges={handleCreateManyExchanges} 
      onDelete={handleDeleteExchange}
      onMultiDelete={handleDeleteMultiExchanges}
    />
  </Card>
}
