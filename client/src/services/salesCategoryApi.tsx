import { GenericResponse, HttpListResponse, HttpResponse, Pagination, QueryOptionArgs, SalesCategory } from "./types";
import { BaseApiService } from "./baseApiService";
import { CacheResource } from "@/context/cacheKey";
import { SalesCategoryWhereInput } from "@/context/salesCategory";
import { CreateSalesCategoryInput, UpdateSalesCategoryInput } from "@/components/content/sales-categories/forms";
import { authApi } from "./authApi";


export class SalesCategoryApiService extends BaseApiService<SalesCategoryWhereInput, SalesCategory> {
  constructor(public repo: CacheResource) { super() }

  static new() {
    return new SalesCategoryApiService(CacheResource.SalesCategory)
  }


  async findMany(
    opt: QueryOptionArgs,
    where: {
      filter?: SalesCategoryWhereInput["where"];
      pagination: Pagination;
      include?: SalesCategoryWhereInput["include"];
    }
  ): Promise<HttpListResponse<SalesCategory>> {
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
      include?: SalesCategoryWhereInput["include"];
    }
  ): Promise<GenericResponse<SalesCategory, "salesCategory"> | undefined> {
    const { filter: { id }, include } = where
    const url = `/${this.repo}/detail/${id}`

    if (!id) return
    const { data } = await authApi.get(url, {
      ...opt,
      params: { include }
    })
    return data
  }


  async create(payload: CreateSalesCategoryInput): Promise<GenericResponse<SalesCategory, "salesCategory">> {
    const url = `/${this.repo}`

    const { data } = await authApi.post(url, payload)
    return data
  }


  async uploadExcel(buf: ArrayBuffer): Promise<HttpListResponse<SalesCategory>> {
    const url = `/${this.repo}/excel-upload`

    const formData = new FormData()
    const blob = new Blob([buf], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' })

    formData.append("excel", blob, `SalesCategories_${Date.now()}.xlsx`)

    const { data } = await authApi.post(url, formData, {
      headers: {
        "Content-Type": "multipart/form-data"
      }
    })

    return data
  }


  async update(arg: { id: string; payload: UpdateSalesCategoryInput }): Promise<GenericResponse<SalesCategory, "salesCategory">> {
    const { id, payload } = arg
    const url = `/${this.repo}/detail/${id}`

    const { data } = await authApi.patch(url, payload)
    return data
  }


  async deleteMany(ids: string[]): Promise<HttpResponse> {
    const url = `/${this.repo}/multi`

    const { data } = await authApi.delete(url, { data: { brandIds: ids } })
    return data
  }


  async delete(id: string): Promise<GenericResponse<SalesCategory, "salesCategory">> {
    const url = `/${this.repo}/detail/${id}`

    const { data } = await authApi.delete(url)
    return data
  }
}
