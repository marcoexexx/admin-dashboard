import { GenericResponse, HttpListResponse, HttpResponse, Pagination, QueryOptionArgs, TownshipFees } from "./types";
import { BaseApiService } from "./baseApiService";
import { CacheResource } from "@/context/cacheKey";
import { TownshipWhereInput } from "@/context/township";
import { CreateTownshipInput, UpdateTownshipInput } from "@/components/content/townships/forms";

import { authApi } from "./authApi";


export class TownshipApiService extends BaseApiService<TownshipWhereInput, TownshipFees> {
  constructor(public repo: CacheResource) { super() }

  static new() {
    return new TownshipApiService(CacheResource.Township)
  }


  async findMany(
    opt: QueryOptionArgs,
    where: {
      filter?: TownshipWhereInput["where"];
      pagination: Pagination;
      include?: TownshipWhereInput["include"];
    }
  ): Promise<HttpListResponse<TownshipFees>> {
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
      include?: TownshipWhereInput["include"];
    }
  ): Promise<GenericResponse<TownshipFees, "township"> | undefined> {
    const { filter: { id }, include } = where
    const url = `/${this.repo}/detail/${id}`

    if (!id) return
    const { data } = await authApi.get(url, {
      ...opt,
      params: { include }
    })
    return data
  }


  async create(payload: CreateTownshipInput): Promise<GenericResponse<TownshipFees, "township">> {
    const url = `/${this.repo}`

    const { data } = await authApi.post(url, payload)
    return data
  }


  async uploadExcel(buf: ArrayBuffer): Promise<HttpListResponse<TownshipFees>> {
    const url = `/${this.repo}/excel-upload`

    const formData = new FormData()
    const blob = new Blob([buf], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' })

    formData.append("excel", blob, `TownshipFees_${Date.now()}.xlsx`)

    const { data } = await authApi.post(url, formData, {
      headers: {
        "Content-Type": "multipart/form-data"
      }
    })

    return data
  }


  async update(arg: { id: string; payload: UpdateTownshipInput }): Promise<GenericResponse<TownshipFees, "township">> {
    const { id, payload } = arg
    const url = `/${this.repo}/detail/${id}`

    const { data } = await authApi.patch(url, payload)
    return data
  }


  async deleteMany(ids: string[]): Promise<HttpResponse> {
    const url = `/${this.repo}/multi`

    const { data } = await authApi.delete(url, { data: { townshipIds: ids } })
    return data
  }


  async delete(id: string): Promise<GenericResponse<TownshipFees, "township">> {
    const url = `/${this.repo}/detail/${id}`

    const { data } = await authApi.delete(url)
    return data
  }
}
