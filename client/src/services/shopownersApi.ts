import { CreateShopownerInput, UpdateShopownerInput } from "@/components/content/shopowners/forms";
import { ShopownerProvider, GenericResponse, HttpListResponse, HttpResponse, Pagination, QueryOptionArgs } from "./types";
import { ShopownerProviderWhereInput } from "@/context/shopowner";
import { BaseApiService } from "./baseApiService";
import { CacheResource } from "@/context/cacheKey";
import { authApi } from "./authApi";


export class ShopownerApiService extends BaseApiService<ShopownerProviderWhereInput, ShopownerProvider> {
  constructor(public repo: CacheResource) { super() }

  static new() {
    return new ShopownerApiService(CacheResource.Shopowner)
  }


  async findMany(
    opt: QueryOptionArgs,
    where: {
      filter?: ShopownerProviderWhereInput["where"];
      pagination: Pagination;
      include?: ShopownerProviderWhereInput["include"];
    }
  ): Promise<HttpListResponse<ShopownerProvider>> {
    const url = `/${this.repo}`
    const { filter, pagination, include } = where

    const { data } = await authApi.get(url, {
      ...opt,
      params: {
        filter,
        pagination,
        include,
        orderBy: {
          updatedAt: "desc"
        },
      },
    })
    return data
  }


  async find(
    opt: QueryOptionArgs,
    where: {
      filter: { id: string | undefined };
      include?: ShopownerProviderWhereInput["include"];
    }
  ): Promise<GenericResponse<ShopownerProvider, "shopowner"> | undefined> {
    const { filter: { id }, include } = where
    const url = `/${this.repo}/detail/${id}`

    if (!id) return
    const { data } = await authApi.get(url, {
      ...opt,
      params: { include }
    })
    return data
  }


  async create(payload: CreateShopownerInput): Promise<GenericResponse<ShopownerProvider, "shopowner">> {
    const url = `/${this.repo}`

    const { data } = await authApi.post(url, payload)
    return data
  }


  async uploadExcel(buf: ArrayBuffer): Promise<HttpListResponse<ShopownerProvider>> {
    const url = `/${this.repo}/excel-upload`

    const formData = new FormData()
    const blob = new Blob([buf], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' })

    formData.append("excel", blob, `Shopowners_${Date.now()}.xlsx`)

    const { data } = await authApi.post(url, formData, {
      headers: {
        "Content-Type": "multipart/form-data"
      }
    })

    return data
  }


  async update(arg: { id: string; payload: UpdateShopownerInput }): Promise<GenericResponse<ShopownerProvider, "shopowner">> {
    const { id, payload } = arg
    const url = `/${this.repo}/detail/${id}`

    const { data } = await authApi.patch(url, payload)
    return data
  }


  async deleteMany(ids: string[]): Promise<HttpResponse> {
    const url = `/${this.repo}/multi`

    const { data } = await authApi.delete(url, { data: { shopownerIds: ids } })
    return data
  }


  async delete(id: string): Promise<GenericResponse<ShopownerProvider, "shopowner">> {
    const url = `/${this.repo}/detail/${id}`

    const { data } = await authApi.delete(url)
    return data
  }
}

