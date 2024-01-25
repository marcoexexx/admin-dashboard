import { useMutation, useQuery } from "@tanstack/react-query";
import { useStore } from "@/hooks";
import { createMultiProductsFn, deleteMultiProductsFn, deleteProductFn, getProductsFn, updateProductFn } from "@/services/productsApi";
import { getMeFn } from "@/services/authApi";
import { Card } from "@mui/material";
import { SuspenseLoader, queryClient } from "@/components";
import { ProductsListTable } from ".";

import { ProductStatus } from "./forms";
import { Product, UserResponse } from "@/services/types";
import { playSoundEffect } from "@/libs/playSound";


export function ProductsList() {
  const { state: {productFilter}, dispatch } = useStore()

  const { data: me, isError: isMeError, isLoading: isMeLoading, error: meError } = useQuery({
    queryKey: ["authUser"],
    queryFn: getMeFn,
    select: (data: UserResponse) => data.user,
  })

  const { data, isError, isLoading, error } = useQuery({
    queryKey: ["products", { filter: productFilter } ],
    queryFn: args => getProductsFn(args, { 
      filter: productFilter?.fields,
      pagination: {
        page: productFilter?.page || 1,
        pageSize: productFilter?.limit || 10
      },
      include: {
        specification: true,
        brand: true,
        categories: {
          include: {
            category: true,
          }
        },
        salesCategory: {
          include: {
            salesCategory: true
          }
        },
        creator: true
      }
    }),
    select: data => data
  })

  const {
    mutate: createProducts,
    isPending,
  } = useMutation({
    mutationFn: createMultiProductsFn,
    onError(err: any) {
      dispatch({ type: "OPEN_TOAST", payload: {
        message: `failed: ${err.response.data.message}`,
        severity: "error"
      } })
      playSoundEffect("error")
    },
    onSuccess() {
      dispatch({ type: "OPEN_TOAST", payload: {
        message: "Success created new products.",
        severity: "success"
      } })
      dispatch({ type: "CLOSE_ALL_MODAL_FORM" })
      queryClient.invalidateQueries({
        queryKey: ["products"]
      })
      playSoundEffect("success")
    }
  })

  const {
    mutate: deleteProduct
  } = useMutation({
    mutationFn: deleteProductFn,
    onError(err: any) {
      dispatch({ type: "OPEN_TOAST", payload: {
        message: `failed: ${err.response.data.message}`,
        severity: err.response.data.status === 403 ? "warning" : "error"
      } })
      playSoundEffect(err.response.data.status === 403 ? "denied" : "error")
    },
    onSuccess() {
      dispatch({ type: "OPEN_TOAST", payload: {
        message: "Success delete a product.",
        severity: "success"
      } })
      dispatch({ type: "CLOSE_ALL_MODAL_FORM" })
      queryClient.invalidateQueries({
        queryKey: ["products"]
      })
      playSoundEffect("success")
    }
  })

  const {
    mutate: deleteProducts
  } = useMutation({
    mutationFn: deleteMultiProductsFn,
    onError(err: any) {
      dispatch({ type: "OPEN_TOAST", payload: {
        message: `failed: ${err.response.data.message}`,
        severity: err.response.data.status === 403 ? "warning" : "error"
      } })
      playSoundEffect(err.response.data.status === 403 ? "denied" : "error")
    },
    onSuccess() {
      dispatch({ type: "OPEN_TOAST", payload: {
        message: "Success delete products.",
        severity: "success"
      } })
      dispatch({ type: "CLOSE_ALL_MODAL_FORM" })
      queryClient.invalidateQueries({
        queryKey: ["products"]
      })
      playSoundEffect("success")
    }
  })

  const {
    mutate: statusChangeProduct,
  } = useMutation({
    mutationFn: updateProductFn,
    onError(err: any) {
      dispatch({ type: "OPEN_TOAST", payload: {
        message: `failed: ${err.response.data.message}`,
        severity: err.response.data.status === 403 ? "warning" : "error"
      } })
      playSoundEffect(err.response.data.status === 403 ? "denied" : "error")
    },
    onSuccess() {
      dispatch({ type: "OPEN_TOAST", payload: {
        message: "Success update product.",
        severity: "success"
      } })
      dispatch({ type: "CLOSE_ALL_MODAL_FORM" })
      queryClient.invalidateQueries({
        queryKey: ["products"]
      })
      playSoundEffect("success")
    }
  })

  function handleCreateManyProducts(data: ArrayBuffer) {
    createProducts(data)
  }

  function handleDeleteProduct(id: string) {
    deleteProduct(id)
  }

  function handleDeleteMultiProducts(ids: string[]) {
    deleteProducts(ids)
  }

  function handleChangeStatusProduct(product: Product, status: ProductStatus) {
    statusChangeProduct({ id: product.id, product: {
      ...product,
      overview: product.overview || undefined,
      description: product.description || undefined,
      status,
      categories: product.categories?.map(x => x.categoryId),
      // TODO: fix type 
      // @ts-ignore
      salesCategory: product.salesCategory?.map(({salesCategoryId, discount}) => ({
        salesCategory: salesCategoryId,
        discount
      }))

    } })
  }


  if (isError && error && isMeError && meError) return <h1>ERROR: {error.message}</h1>

  if (!data || isLoading || !me || isMeLoading) return <SuspenseLoader />


  return <Card>
    <ProductsListTable
      me={me}
      isLoading={isPending}
      onStatusChange={handleChangeStatusProduct}
      products={data.results} 
      count={data.count} 
      onCreateManyProducts={handleCreateManyProducts} 
      onDelete={handleDeleteProduct}
      onMultiDelete={handleDeleteMultiProducts}
    />
  </Card>
}
