import { CreatePickupAddressInput } from "@/components/content/pickupAddressHistory/forms";
import { CacheResource } from "@/context/cacheKey";
import { PickupAddressWhereInput } from "@/context/pickupAddress";
import { BaseApiService } from "./baseApiService";
import {
  GenericResponse,
  HttpListResponse,
  HttpResponse,
  Pagination,
  PickupAddress,
  QueryOptionArgs,
} from "./types";

import { authApi } from "./authApi";

export class PickupAddressApiService
  extends BaseApiService<PickupAddressWhereInput, PickupAddress>
{
  constructor(public repo: CacheResource) {
    super();
  }

  static new() {
    return new PickupAddressApiService(CacheResource.PickupAddress);
  }

  override async findMany(
    opt: QueryOptionArgs,
    where: {
      filter?: PickupAddressWhereInput["where"];
      pagination: Pagination;
      include?: PickupAddressWhereInput["include"];
    },
  ): Promise<HttpListResponse<PickupAddress>> {
    const url = `/${this.repo}`;
    const { filter, pagination, include } = where;

    const { data } = await authApi.get(url, {
      ...opt,
      params: {
        filter,
        pagination,
        include,
      },
    });
    return data;
  }

  override async find(
    opt: QueryOptionArgs,
    where: {
      filter: { id: string | undefined; };
      include?: PickupAddressWhereInput["include"];
    },
  ): Promise<GenericResponse<PickupAddress, "pickupAddress"> | undefined> {
    const { filter: { id }, include } = where;
    const url = `/${this.repo}/detail/${id}`;

    if (!id) return;
    const { data } = await authApi.get(url, {
      ...opt,
      params: { include },
    });
    return data;
  }

  override async create(
    payload: CreatePickupAddressInput,
  ): Promise<GenericResponse<PickupAddress, "pickupAddress">> {
    const url = `/${this.repo}`;

    const { data } = await authApi.post(url, payload);
    return data;
  }

  override async deleteMany(ids: string[]): Promise<HttpResponse> {
    const url = `/${this.repo}/multi`;

    const { data } = await authApi.delete(url, {
      data: { pickupAddressIds: ids },
    });
    return data;
  }

  override async delete(
    id: string,
  ): Promise<GenericResponse<PickupAddress, "pickupAddress">> {
    const url = `/${this.repo}/detail/${id}`;

    const { data } = await authApi.delete(url);
    return data;
  }
}
