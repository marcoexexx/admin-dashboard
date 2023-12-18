import { CreateProductInput, DeleteProductInput, UpdateProductInput } from "@/components/content/products/forms";
import { authApi } from "./authApi";


export async function getProductsFn(opt: QueryOptionArgs, { filter, include, pagination }: { filter: any, include: any, pagination: any }) {
  const { data } = await authApi.get<HttpListResponse<IProduct>>("/products", {
    ...opt,
    params: {
      filter,
      include,
      pagination
    }
  })
  return data
}


export async function getProductFn(opt: QueryOptionArgs, { productId }: { productId: string | undefined}) {
  if (!productId) return
  const { data } = await authApi.get<ProductResponse>(`/products/detail/${productId}?include[specification]=true&include[_count]=true&include[likedUsers]=true&include[brand]=true&include[categories][include][category]=true&include[salesCategory][include][salesCategory]=true`, {
    ...opt,
  })
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


// TODO: multi create product type
export async function createMultiProductsFn(product: any[]) {
  const { data } = await authApi.post<HttpResponse>("/products/multi", product)
  return data
}


export async function createProductFn(product: CreateProductInput) {
  const { data } = await authApi.post<ProductResponse>("/products", product)
  return data
}


export async function deleteProductFn(productId: DeleteProductInput["productId"]) {
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


export async function deleteMultiProductsFn(productIds: DeleteProductInput["productId"][]) {
  await Promise.all(productIds.map(id => authApi.delete(`/products/detail/${id}`)))
  return null
}
