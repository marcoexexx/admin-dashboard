import { useStore, useMe, useCombineQuerys } from "@/hooks";
import { useCreateMultiProducts, useDeleteMultiProducts, useDeleteProduct, useGetProducts } from "@/hooks/product";
import { useUpdateProduct } from "@/hooks/product/use-update-product";

import { Card } from "@mui/material";
import { ProductsListTable } from ".";
import { ProductStatus } from "./forms";
import { Product } from "@/services/types";
import { SuspenseLoader } from "@/components";


export function ProductsList() {
  const { state: {productFilter} } = useStore()

  // Queries
  const meQuery = useMe()
  const productsQuery = useGetProducts({ filter: productFilter })

  // Mutations
  const createProductsMutation = useCreateMultiProducts()
  const deleteProductMutation = useDeleteProduct()
  const deleteProductsMutation = useDeleteMultiProducts()
  const statusChangeProductMutation = useUpdateProduct()

  const { isLoading } = useCombineQuerys(
    meQuery, 
    productsQuery, 
    createProductsMutation, 
    deleteProductsMutation, 
    deleteProductMutation, 
    statusChangeProductMutation
  )

  // Extraction
  const me = meQuery.try_data.ok_or_throw()
  const data = productsQuery.try_data.ok_or_throw()


  function handleCreateManyProducts(data: ArrayBuffer) {
    createProductsMutation.mutate(data)
  }

  function handleDeleteProduct(id: string) {
    deleteProductMutation.mutate(id)
  }

  function handleDeleteMultiProducts(ids: string[]) {
    deleteProductsMutation.mutate(ids)
  }

  function handleChangeStatusProduct(product: Product, status: ProductStatus) {
    statusChangeProductMutation.mutate({ id: product.id, product: {
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


  // TODO: Skeleton table loader
  if (!me || !data) return <SuspenseLoader />


  return <Card>
    <ProductsListTable
      me={me}
      isLoading={isLoading}
      onStatusChange={handleChangeStatusProduct}
      products={data.results} 
      count={data.count} 
      onCreateManyProducts={handleCreateManyProducts} 
      onDelete={handleDeleteProduct}
      onMultiDelete={handleDeleteMultiProducts}
    />
  </Card>
}
