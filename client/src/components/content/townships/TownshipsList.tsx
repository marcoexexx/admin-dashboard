import { Card } from "@mui/material";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useStore } from "@/hooks";
import { SuspenseLoader, queryClient } from "@/components";
import { createMultiTownshipsFn, deleteMultiTownshipsFn, deleteTownshipFn, getTownshipsFn } from "@/services/TownshipsApi";
import { TownshipsListTable } from ".";


export function TownshipsList() {
  const { state: {townshipFilter}, dispatch } = useStore()

  const { data, isError, isLoading, error } = useQuery({
    queryKey: ["townships", { filter: townshipFilter } ],
    queryFn: args => getTownshipsFn(args, { 
      filter: townshipFilter?.fields,
      pagination: {
        page: townshipFilter?.page || 1,
        pageSize: townshipFilter?.limit || 10
      },
      include: {
        region: true
      }
    }),
    select: data => data
  })

  const {
    mutate: createTownships,
    isPending
  } = useMutation({
    mutationFn: createMultiTownshipsFn,
    onError(err: any) {
      dispatch({ type: "OPEN_TOAST", payload: {
        message: `failed: ${err.response.data.message}`,
        severity: "error"
      } })
    },
    onSuccess() {
      dispatch({ type: "OPEN_TOAST", payload: {
        message: "Success created new cities.",
        severity: "success"
      } })
      dispatch({ type: "CLOSE_ALL_MODAL_FORM" })
      queryClient.invalidateQueries({
        queryKey: ["townships"]
      })
    }
  })

  const {
    mutate: deleteTownship
  } = useMutation({
    mutationFn: deleteTownshipFn,
    onError(err: any) {
      dispatch({ type: "OPEN_TOAST", payload: {
        message: `failed: ${err.response.data.message}`,
        severity: "error"
      } })
    },
    onSuccess() {
      dispatch({ type: "OPEN_TOAST", payload: {
        message: "Success delete a township.",
        severity: "success"
      } })
      dispatch({ type: "CLOSE_ALL_MODAL_FORM" })
      queryClient.invalidateQueries({
        queryKey: ["townships"]
      })
    }
  })

  const {
    mutate: deleteTownships
  } = useMutation({
    mutationFn: deleteMultiTownshipsFn,
    onError(err: any) {
      dispatch({ type: "OPEN_TOAST", payload: {
        message: `failed: ${err.response.data.message}`,
        severity: "error"
      } })
    },
    onSuccess() {
      dispatch({ type: "OPEN_TOAST", payload: {
        message: "Success delete multi cities.",
        severity: "success"
      } })
      dispatch({ type: "CLOSE_ALL_MODAL_FORM" })
      queryClient.invalidateQueries({
        queryKey: ["townships"]
      })
    }
  })


  if (isError && error) return <h1>ERROR: {error.message}</h1>

  if (!data || isLoading) return <SuspenseLoader />

  function handleCreateManyTownships(buf: ArrayBuffer) {
    createTownships(buf)
  }

  function handleDeleteTownship(id: string) {
    deleteTownship(id)
  }

  function handleDeleteMultiTownships(ids: string[]) {
    deleteTownships(ids)
  }

  return <Card>
    <TownshipsListTable
      isLoading={isPending}
      townships={data.results} 
      count={data.count} 
      onCreateManyTownships={handleCreateManyTownships} 
      onDelete={handleDeleteTownship}
      onMultiDelete={handleDeleteMultiTownships}
    />
  </Card>
}
