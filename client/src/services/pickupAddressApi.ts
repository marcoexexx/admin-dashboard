import AppError, { AppErrorKind } from "@/libs/exceptions";

import { CreatePickupAddressInput } from "@/components/content/pickupAddressHistory/forms";
import { GenericResponse, HttpListResponse, HttpResponse, Pagination, PickupAddress, QueryOptionArgs } from "./types";
import { PickupAddressWhereInput } from "@/context/pickupAddress";
import { BaseApiService } from "./baseApiService";
import { CacheResource } from "@/context/cacheKey";

import { authApi } from "./authApi";


export class PickupAddressApiService extends BaseApiService<PickupAddressWhereInput, PickupAddress> {
  constructor(public repo: CacheResource) { super() }

  static new() {
    return new PickupAddressApiService(CacheResource.PickupAddress)
  }


  async findMany(
    opt: QueryOptionArgs,
    where: {
      filter?: PickupAddressWhereInput["where"];
      pagination: Pagination;
      include?: PickupAddressWhereInput["include"];
    }
  ): Promise<HttpListResponse<PickupAddress>> {
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
      include?: PickupAddressWhereInput["include"];
    }
  ): Promise<GenericResponse<PickupAddress, "pickupAddress"> | undefined> {
    const { filter: { id }, include } = where
    const url = `/${this.repo}/detail/${id}`

    if (!id) return
    const { data } = await authApi.get(url, {
      ...opt,
      params: { include }
    })
    return data
  }


  async create(payload: CreatePickupAddressInput): Promise<GenericResponse<PickupAddress, "pickupAddress">> {
    const url = `/${this.repo}`

    const { data } = await authApi.post(url, payload)
    return data
  }


  /**
  * Not Support yet!
  */
  async uploadExcel(_buf: ArrayBuffer): Promise<HttpListResponse<PickupAddress>> {
    return Promise.reject(AppError.new(AppErrorKind.ServiceUnavailable, `Not support yet!`))
  }


  /**
  * Not Support yet!
  */
  async update(_arg: { id: string; payload: any }): Promise<GenericResponse<PickupAddress, "pickupAddress">> {
    return Promise.reject(AppError.new(AppErrorKind.ServiceUnavailable, `Not support yet!`))
  }


  async deleteMany(ids: string[]): Promise<HttpResponse> {
    const url = `/${this.repo}/multi`

    const { data } = await authApi.delete(url, { data: { pickupAddressIds: ids } })
    return data
  }


  async delete(id: string): Promise<GenericResponse<PickupAddress, "pickupAddress">> {
    const url = `/${this.repo}/detail/${id}`

    const { data } = await authApi.delete(url)
    return data
  }
}
