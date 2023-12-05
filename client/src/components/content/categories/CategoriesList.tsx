import { Card } from "@mui/material";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useStore } from "@/hooks";
import { SuspenseLoader, queryClient } from "@/components";
import { CategoriesListTable } from "@/components/content/categories";
import { createMultiCategorisFn, deleteCategoryFn, deleteMultiCategoriesFn, getCategoriesFn } from "@/services/categoryApi";
import { CreateCategoryInput } from "./forms";

export function CategoriesList() {
  const { state: {categoryFilter}, dispatch } = useStore()

  const { data, isError, isLoading, error } = useQuery({
    queryKey: ["categories", { filter: categoryFilter } ],
    queryFn: args => getCategoriesFn(args, { 
      filter: categoryFilter?.fields,
      pagination: {
        page: categoryFilter?.page || 1,
        pageSize: categoryFilter?.limit || 10
      },
    }),
    select: data => data
  })

  const {
    mutate: createCategories
  } = useMutation({
    mutationFn: createMultiCategorisFn,
    onError(err: any) {
      dispatch({ type: "OPEN_TOAST", payload: {
        message: `failed: ${err.response.data.message}`,
        severity: "error"
      } })
    },
    onSuccess() {
      dispatch({ type: "OPEN_TOAST", payload: {
        message: "Success created new categories.",
        severity: "success"
      } })
      dispatch({ type: "CLOSE_ALL_MODAL_FORM" })
      queryClient.invalidateQueries({
        queryKey: ["categories"]
      })
    }
  })

  const {
    mutate: deleteCategory
  } = useMutation({
    mutationFn: deleteCategoryFn,
    onError(err: any) {
      dispatch({ type: "OPEN_TOAST", payload: {
        message: `failed: ${err.response.data.message}`,
        severity: "error"
      } })
    },
    onSuccess() {
      dispatch({ type: "OPEN_TOAST", payload: {
        message: "Success delete a category.",
        severity: "success"
      } })
      dispatch({ type: "CLOSE_ALL_MODAL_FORM" })
      queryClient.invalidateQueries({
        queryKey: ["categories"]
      })
    }
  })

  const {
    mutate: deleteCategories
  } = useMutation({
    mutationFn: deleteMultiCategoriesFn,
    onError(err: any) {
      dispatch({ type: "OPEN_TOAST", payload: {
        message: `failed: ${err.response.data.message}`,
        severity: "error"
      } })
    },
    onSuccess() {
      dispatch({ type: "OPEN_TOAST", payload: {
        message: "Success delete multi categories.",
        severity: "success"
      } })
      dispatch({ type: "CLOSE_ALL_MODAL_FORM" })
      queryClient.invalidateQueries({
        queryKey: ["categories"]
      })
    }
  })


  if (isError && error) return <h1>ERROR: {JSON.stringify(error)}</h1>

  if (!data || isLoading) return <SuspenseLoader />

  function handleCreateManyCategories(data: CreateCategoryInput[]) {
    createCategories(data)
  }

  function handleDeleteCategory(id: string) {
    deleteCategory(id)
  }

  function handleDeleteMultiCategories(ids: string[]) {
    deleteCategories(ids)
  }

  return <Card>
    <CategoriesListTable 
      categories={data.results} 
      count={data.count} 
      onCreateManyCategories={handleCreateManyCategories} 
      onDelete={handleDeleteCategory}
      onMultiDelete={handleDeleteMultiCategories}
    />
  </Card>
}
