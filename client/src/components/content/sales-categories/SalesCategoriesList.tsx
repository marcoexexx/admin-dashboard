import { Card } from "@mui/material";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useStore } from "@/hooks";
import { SuspenseLoader, queryClient } from "@/components";
import { createMultiSalesCategorisFn, deleteMultiSalesCategoriesFn, deleteSalesCategoryFn, getSalesCategoriesFn } from "@/services/salesCategoryApi";
import { SalesCategoriesListTable } from "./SalesCategoriesListTable";


export function SalesCategoriesList() {
  const { state: {salesCategoryFilter}, dispatch } = useStore()

  const { data, isError, isLoading, error } = useQuery({
    queryKey: ["sales-categories", { filter: salesCategoryFilter } ],
    queryFn: args => getSalesCategoriesFn(args, { 
      filter: salesCategoryFilter?.fields,
      pagination: {
        page: salesCategoryFilter?.page || 1,
        pageSize: salesCategoryFilter?.limit || 10
      },
      include: {
        _count: true
      }
    }),
    select: data => data
  })

  const {
    mutate: createSalesCategories,
    isPending
  } = useMutation({
    mutationFn: createMultiSalesCategorisFn,
    onError(err: any) {
      dispatch({ type: "OPEN_TOAST", payload: {
        message: `failed: ${err.response.data.message}`,
        severity: "error"
      } })
    },
    onSuccess() {
      dispatch({ type: "OPEN_TOAST", payload: {
        message: "Success created new sales category.",
        severity: "success"
      } })
      dispatch({ type: "CLOSE_ALL_MODAL_FORM" })
      queryClient.invalidateQueries({
        queryKey: ["sales-categories"]
      })
    }
  })

  const {
    mutate: deleteSalesCategory
  } = useMutation({
    mutationFn: deleteSalesCategoryFn,
    onError(err: any) {
      dispatch({ type: "OPEN_TOAST", payload: {
        message: `failed: ${err.response.data.message}`,
        severity: "error"
      } })
    },
    onSuccess() {
      dispatch({ type: "OPEN_TOAST", payload: {
        message: "Success delete a sales category.",
        severity: "success"
      } })
      dispatch({ type: "CLOSE_ALL_MODAL_FORM" })
      queryClient.invalidateQueries({
        queryKey: ["sales-categories"]
      })
    }
  })

  const {
    mutate: deleteSalesCategories
  } = useMutation({
    mutationFn: deleteMultiSalesCategoriesFn,
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
        queryKey: ["sales-categories"]
      })
    }
  })


  if (isError && error) return <h1>ERROR: {JSON.stringify(error)}</h1>

  if (!data || isLoading) return <SuspenseLoader />

  function handleCreateManySalesCategories(buf: ArrayBuffer) {
    createSalesCategories(buf)
  }

  function handleDeleteBrand(id: string) {
    deleteSalesCategory(id)
  }

  function handleDeleteMultiSalesCategories(ids: string[]) {
    deleteSalesCategories(ids)
  }

  return <Card>
    <SalesCategoriesListTable
      salesCategoiries={data.results} 
      count={data.count} 
      isLoading={isPending}
      onCreateManySalesCategories={handleCreateManySalesCategories} 
      onDelete={handleDeleteBrand}
      onMultiDelete={handleDeleteMultiSalesCategories}
    />
  </Card>
}
