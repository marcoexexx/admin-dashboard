import { CreateBrandInput } from "@/components";
import { authApi } from "./authApi";

// TODO
export async function getBrandsFn(opt: QueryOptionArgs, { filter }: { filter: any }) {
  const { data } = await authApi.get<HttpListResponse<IBrand>>("/brands", {
    ...opt,
    params: {
      filter
    },
  })
  return data
}


export async function createBrandFn(brand: CreateBrandInput) {
  const { data } = await authApi.post<IBrand>("/brands", brand)
  return data
}
