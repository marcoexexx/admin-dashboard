import { Card } from "@mui/material";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useStore } from "@/hooks";
import { SuspenseLoader, queryClient } from "@/components";
import { createMultiCitiesFn, deleteCityFn, deleteMultiCitiesFn, getCitiesFn } from "@/services/citiesApi";
import { CitiesListTable } from ".";


export function CitiesList() {
  const { state: {cityFilter}, dispatch } = useStore()

  const { data, isError, isLoading, error } = useQuery({
    queryKey: ["cities", { filter: cityFilter } ],
    queryFn: args => getCitiesFn(args, { 
      filter: cityFilter?.fields,
      pagination: {
        page: cityFilter?.page || 1,
        pageSize: cityFilter?.limit || 10
      },
    }),
    select: data => data
  })

  const {
    mutate: createCities,
    isPending
  } = useMutation({
    mutationFn: createMultiCitiesFn,
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
        queryKey: ["cities"]
      })
    }
  })

  const {
    mutate: deleteCity
  } = useMutation({
    mutationFn: deleteCityFn,
    onError(err: any) {
      dispatch({ type: "OPEN_TOAST", payload: {
        message: `failed: ${err.response.data.message}`,
        severity: "error"
      } })
    },
    onSuccess() {
      dispatch({ type: "OPEN_TOAST", payload: {
        message: "Success delete a city.",
        severity: "success"
      } })
      dispatch({ type: "CLOSE_ALL_MODAL_FORM" })
      queryClient.invalidateQueries({
        queryKey: ["cities"]
      })
    }
  })

  const {
    mutate: deleteCities
  } = useMutation({
    mutationFn: deleteMultiCitiesFn,
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
        queryKey: ["cities"]
      })
    }
  })


  if (isError && error) return <h1>ERROR: {error.message}</h1>

  if (!data || isLoading) return <SuspenseLoader />

  function handleCreateManyCities(buf: ArrayBuffer) {
    createCities(buf)
  }

  function handleDeleteCity(id: string) {
    deleteCity(id)
  }

  function handleDeleteMultiCities(ids: string[]) {
    deleteCities(ids)
  }

  return <Card>
    <CitiesListTable
      isLoading={isPending}
      cities={data.results} 
      count={data.count} 
      onCreateManyCities={handleCreateManyCities} 
      onDelete={handleDeleteCity}
      onMultiDelete={handleDeleteMultiCities}
    />
  </Card>
}
