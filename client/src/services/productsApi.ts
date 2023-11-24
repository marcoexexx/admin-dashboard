import { CreateProductInput } from "@/components/forms";
import { authApi } from "./authApi";

// TODO: fix filter type
export async function getProductsFn(opt: QueryOptionArgs, { filter }: { filter: any }) {
  const { data } = await authApi.get<HttpListResponse<IProduct>>("/products", {
    ...opt,
    params: {
      filter
    }
  })
  return data
}

export async function getProductFn(productId: string) {
  const { data } = await authApi.get<ProductResponse>("/products/detail", {
    params: {
      productId
    }
  })
  return data
}

export async function createProductFn(product: CreateProductInput) {
  const { data } = await authApi.post<ProductResponse>("/products", product)
  return data
}
