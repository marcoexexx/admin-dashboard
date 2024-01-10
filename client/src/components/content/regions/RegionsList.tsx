import { Card } from "@mui/material";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useStore } from "@/hooks";
import { SuspenseLoader, queryClient } from "@/components";
import { createMultiRegionsFn, deleteMultiRegionsFn, deleteRegionFn, getRegionsFn } from "@/services/regionsApi";
import { RegionsListTable } from ".";


export function RegionsList() {
  const { state: {regionFilter}, dispatch } = useStore()

  const { data, isError, isLoading, error } = useQuery({
    queryKey: ["regions", { filter: regionFilter } ],
    queryFn: args => getRegionsFn(args, { 
      filter: regionFilter?.fields,
      pagination: {
        page: regionFilter?.page || 1,
        pageSize: regionFilter?.limit || 10
      },
      include: {
        townships: true
      }
    }),
    select: data => data
  })

  const {
    mutate: createRegions,
    isPending
  } = useMutation({
    mutationFn: createMultiRegionsFn,
    onError(err: any) {
      dispatch({ type: "OPEN_TOAST", payload: {
        message: `failed: ${err.response.data.message}`,
        severity: "error"
      } })
    },
    onSuccess() {
      dispatch({ type: "OPEN_TOAST", payload: {
        message: "Success created new brands.",
        severity: "success"
      } })
      dispatch({ type: "CLOSE_ALL_MODAL_FORM" })
      queryClient.invalidateQueries({
        queryKey: ["regions"]
      })
    }
  })

  const {
    mutate: deleteRegion
  } = useMutation({
    mutationFn: deleteRegionFn,
    onError(err: any) {
      dispatch({ type: "OPEN_TOAST", payload: {
        message: `failed: ${err.response.data.message}`,
        severity: "error"
      } })
    },
    onSuccess() {
      dispatch({ type: "OPEN_TOAST", payload: {
        message: "Success delete a brand.",
        severity: "success"
      } })
      dispatch({ type: "CLOSE_ALL_MODAL_FORM" })
      queryClient.invalidateQueries({
        queryKey: ["regions"]
      })
    }
  })

  const {
    mutate: deleteRegions
  } = useMutation({
    mutationFn: deleteMultiRegionsFn,
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
        queryKey: ["regions"]
      })
    }
  })


  if (isError && error) return <h1>ERROR: {JSON.stringify(error)}</h1>

  if (!data || isLoading) return <SuspenseLoader />

  function handleCreateManyRegions(buf: ArrayBuffer) {
    createRegions(buf)
  }

  function handleDeleteRegion(id: string) {
    deleteRegion(id)
  }

  function handleDeleteMultiRegions(ids: string[]) {
    deleteRegions(ids)
  }

  return <Card>
    <RegionsListTable
      isLoading={isPending}
      regions={data.results} 
      count={data.count} 
      onCreateManyRegions={handleCreateManyRegions} 
      onDelete={handleDeleteRegion}
      onMultiDelete={handleDeleteMultiRegions}
    />
  </Card>
}
