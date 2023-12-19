import { Card } from "@mui/material";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useStore } from "@/hooks";
import { SuspenseLoader, queryClient } from "@/components";
import { createMultiProductsFn, deleteMultiProductsFn, deleteProductFn, getProductsFn, updateProductFn } from "@/services/productsApi";
import { ProductsListTable } from ".";


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

  const { data, isError, isLoading, error } = useQuery({
    queryKey: ["products", { filter: productFilter } ],
    queryFn: args => getProductsFn(args, { 
      filter: productFilter?.fields,
      pagination: {
        page: productFilter?.page || 1,
        pageSize: productFilter?.limit || 10
      },
      include: productFilter?.include
    }),
    select: data => data
  })

  const {
    mutate: createProducts
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

  function handleChangeStatusProduct(product: IProduct, status: ProductStatus) {
    try {
      const safedStatus = getProductStatusConcrate[product.status](status)

      statusChangeProduct({ id: product.id, product: {
        ...product,
        status: safedStatus,
        salesCategory: product.salesCategory.map(x => x.salesCategoryId),
        categories: product.categories.map(x => x.categoryId),
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


  if (isError && error) return <h1>ERROR: {error.message}</h1>

  if (!data || isLoading) return <SuspenseLoader />


  return <Card>
    <ProductsListTable
      onStatusChange={handleChangeStatusProduct}
      products={data.results} 
      count={data.count} 
      onCreateManyProducts={handleCreateManyProducts} 
      onDelete={handleDeleteProduct}
      onMultiDelete={handleDeleteMultiProducts}
    />
  </Card>
}
