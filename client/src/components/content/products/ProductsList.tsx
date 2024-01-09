import { useMutation, useQuery } from "@tanstack/react-query";
import { useStore } from "@/hooks";
import { createMultiProductsFn, deleteMultiProductsFn, deleteProductFn, getProductsFn, updateProductFn } from "@/services/productsApi";
import { getMeFn } from "@/services/authApi";
import { Card } from "@mui/material";
import { SuspenseLoader, queryClient } from "@/components";
import { ProductsListTable } from ".";

import { ProductStatus } from "./forms";
import { Product, UserResponse } from "@/services/types";


interface ProductStatusContext {
  requestReview: () => ProductStatus
  approve: () => ProductStatus
  makeDraft: () => ProductStatus
}

type ProductStatusHandler = () => ProductStatusContext

const handleDraftProductStatus: ProductStatusHandler = () => ({
  requestReview: () => "Pending",
  approve: () => { throw new Error("Can not publish Draft status.") },
  makeDraft: () => { throw new Error("Product already Draft status.") },
})

const handlePendingProductStatus: ProductStatusHandler = () => ({
  requestReview: () => { throw new Error("Product already Pending status.") },
  approve: () => "Published",
  makeDraft: () => "Draft",
})

const handlePublishedProductStatus: ProductStatusHandler = () => ({
  requestReview: () => { throw new Error("Published product can not be Pending status.") },
  approve: () => { throw new Error("Product already in Published status.") },
  makeDraft: () => "Draft",
})

const getProductStatusContext: Record<ProductStatus, "approve" | "requestReview" | "makeDraft"> = {
  Draft: "makeDraft",
  Pending: "requestReview",
  Published: "approve"
}

const getProductStatusConcrate: Record<ProductStatus, (status: ProductStatus) => ProductStatus> = ({
  Draft: (status) => handleDraftProductStatus()[getProductStatusContext[status]](),
  Pending: (status) => handlePendingProductStatus()[getProductStatusContext[status]](),
  Published: (status) => handlePublishedProductStatus()[getProductStatusContext[status]]()
})


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
    }
  })

  const {
    mutate: deleteProduct
  } = useMutation({
    mutationFn: deleteProductFn,
    onError(err: any) {
      dispatch({ type: "OPEN_TOAST", payload: {
        message: `failed: ${err.response.data.message}`,
        severity: "error"
      } })
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
    }
  })

  const {
    mutate: deleteProducts
  } = useMutation({
    mutationFn: deleteMultiProductsFn,
    onError(err: any) {
      dispatch({ type: "OPEN_TOAST", payload: {
        message: `failed: ${err.response.data.message}`,
        severity: "error"
      } })
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
    }
  })

  const {
    mutate: statusChangeProduct,
  } = useMutation({
    mutationFn: updateProductFn,
    onError(err: any) {
      dispatch({ type: "OPEN_TOAST", payload: {
        message: `failed: ${err.response.data.message}`,
        severity: "error"
      } })
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
    try {
      const safedStatus = getProductStatusConcrate[product.status](status)

      console.log({ sp: product.salesCategory })

      statusChangeProduct({ id: product.id, product: {
        ...product,
        overview: product.overview || undefined,
        description: product.description || undefined,
        status: safedStatus,
        categories: product.categories?.map(x => x.categoryId),
        salesCategory: product.salesCategory?.map(({salesCategoryId, discount}) => ({
          salesCategory: salesCategoryId,
          discount
        }))

      } })
    } catch (err: any) {
      const message = err instanceof Error ? err.message : "unknown error"
      dispatch({
        type: "OPEN_TOAST",
        payload: {
          message,
          severity: "warning"
        }
      })
    }
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
