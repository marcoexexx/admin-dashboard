import { Card } from "@mui/material";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useStore } from "@/hooks";
import { SuspenseLoader, queryClient } from "@/components";
import { BrandsListTable } from "@/components/content/brands";
import { createMultiBrandsFn, deleteBrandFn, getBrandsFn } from "@/services/brandsApi";
import { CreateBrandInput } from "./forms";

export function BrandsList() {
  const { state: {brandFilter}, dispatch } = useStore()

  const { data, isError, isLoading, error } = useQuery({
    queryKey: ["brands", { filter: brandFilter } ],
    queryFn: args => getBrandsFn(args, { 
      filter: brandFilter?.fields,
      pagination: {
        page: brandFilter?.page || 1,
        pageSize: brandFilter?.limit || 10
      },
    }),
    select: data => data
  })

  const {
    mutate: createBrands
  } = useMutation({
    mutationFn: createMultiBrandsFn,
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
        queryKey: ["brands"]
      })
    }
  })

  const {
    mutate: deleteBrand
  } = useMutation({
    mutationFn: deleteBrandFn,
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
        queryKey: ["brands"]
      })
    }
  })

  if (!data && isError || error) return <h1>ERROR: {JSON.stringify(error)}</h1>

  if (!data || isLoading) return <SuspenseLoader />

  function handleCreateManyBrands(data: CreateBrandInput[]) {
    createBrands(data)
  }

  function handleDeleteBrand(id: string) {
    deleteBrand(id)
  }

  return <Card>
    <BrandsListTable 
      brands={data.results} 
      count={data.count} 
      onCreateManyBrands={handleCreateManyBrands} 
      onDelete={handleDeleteBrand}
    />
  </Card>
}
