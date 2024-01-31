import { authApi } from "./authApi";
import { CreateProductInput, ProductStatus, UpdateProductInput } from "@/components/content/products/forms";
import { HttpListResponse, HttpResponse, Pagination, Product, ProductResponse, ProductSalesCategoriesResponse, QueryOptionArgs } from "./types";
import { ProductFilter } from "@/context/product";


export async function getProductsFn(opt: QueryOptionArgs, { filter, include, pagination }: { filter: ProductFilter["fields"], include?: ProductFilter["include"], pagination: Pagination }) {
  const { data } = await authApi.get<HttpListResponse<Product>>("/products", {
    ...opt,
    params: {
      filter,
      include,
      pagination,
      orderBy: {
        updatedAt: "desc"
      }
    }
  })
  return data
}


export async function getProductFn(opt: QueryOptionArgs, { productId, include }: { productId: string | undefined, include?: ProductFilter["include"] }) {
  if (!productId) return
  const { data } = await authApi.get<ProductResponse>(`/products/detail/${productId}`, {
    ...opt,
    params: {
      include
    }
  })
  return data
}


export async function getProductSaleCategories(opt: QueryOptionArgs, { productId }: { productId: string | undefined }) {
  if (!productId) return
  const { data } = await authApi.get<HttpListResponse<ProductSalesCategoriesResponse>>(`/products/detail/${productId}/sales`, {
    ...opt,
  })
  return data
}


export async function createProductSaleCategory({ productId, salesCategoryId, discount }: { productId: string, salesCategoryId: string, discount: number }) {
  if (!productId && !salesCategoryId) return
  const res = await authApi.post(`/products/detail/${productId}/sales`, { salesCategoryId, discount })
  return res.data
}


export async function deleteProductSaleCategory({ productId, productSaleCategoryId }: { productId: string, productSaleCategoryId: string }) {
  if (!productId) return
  const data = await authApi.delete(`/products/detail/${productId}/sales/detail/${productSaleCategoryId}`)
  return data
}


export async function updateProductSaleCategoryFn({ productId, productSaleCategoryId, discount }: { productId: string, productSaleCategoryId: string, discount: number }) {
  if (!productId && !productSaleCategoryId) return
  const data = await authApi.patch(`/products/detail/${productId}/sales/detail/${productSaleCategoryId}`, { discount })
  return data
}


export async function likeProductByUserFn({ userId, productId }: { userId: string, productId: string }) {
  const { data } = await authApi.patch<ProductResponse>(`/products/like/${productId}`, { userId })
  return data
}


export async function unLikeProductByUserFn({ userId, productId }: { userId: string, productId: string }) {
  const { data } = await authApi.patch<HttpResponse>(`/products/unlike/${productId}`, { userId })
  return data
}


export async function createMultiProductsFn(excelBuffer: ArrayBuffer) {
  const formData = new FormData()

  const excelBlob = new Blob([excelBuffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' })

  formData.append("excel", excelBlob, `Products_${Date.now()}.xlsx`)

  const { data } = await authApi.post<HttpResponse>("/products/excel-upload", formData, {
    headers: {
      "Content-Type": "multipart/form-data"
    }
  })

  return data
}


export async function createProductFn(product: CreateProductInput) {
  // TODO: services -> create::product
  const { data } = await authApi.post<ProductResponse>("/products", product)
  return data
}


export async function deleteProductFn(productId: string) {
  const { data } = await authApi.delete<HttpResponse>(`/products/detail/${productId}`)
  return data
}


export async function updateProductFn(
  {
    id, product
  }: {
    id: string, 
    product: Partial<
      Omit<UpdateProductInput, "isPending"> & { status: ProductStatus }
    >
  }
) {
  const { data } = await authApi.patch<ProductResponse>(`/products/detail/${id}`, product)
  return data
}


export async function deleteMultiProductsFn(productIds: string[]) {
  const { data } = await authApi.delete<HttpResponse>("/products/multi", {
    data: { productIds }
  })
  return data
}
