import {
  CreatePotentialOrderInput,
  UpdatePotentialOrderInput,
} from "@/components/content/potential-orders/forms";
import { CacheResource } from "@/context/cacheKey";
import { PotentialOrderWhereInput } from "@/context/order";
import { BaseApiService } from "./baseApiService";
import {
  GenericResponse,
  HttpListResponse,
  HttpResponse,
  Pagination,
  PotentialOrder,
  QueryOptionArgs,
} from "./types";

import { authApi } from "./authApi";

export class PotentialOrderApiService
  extends BaseApiService<PotentialOrderWhereInput, PotentialOrder>
{
  constructor(public repo: CacheResource) {
    super();
  }

  static new() {
    return new PotentialOrderApiService(CacheResource.PotentialOrder);
  }

  override async findMany(
    opt: QueryOptionArgs,
    where: {
      filter?: PotentialOrderWhereInput["where"];
      pagination: Pagination;
      include?: PotentialOrderWhereInput["include"];
    },
  ): Promise<HttpListResponse<PotentialOrder>> {
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
      include?: PotentialOrderWhereInput["include"];
    },
  ): Promise<
    GenericResponse<PotentialOrder, "potentialOrder"> | undefined
  > {
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
    payload: CreatePotentialOrderInput,
  ): Promise<GenericResponse<PotentialOrder, "potentialOrder">> {
    const url = `/${this.repo}`;

    const { data } = await authApi.post(url, payload);
    return data;
  }

  override async update(
    arg: { id: string; payload: UpdatePotentialOrderInput; },
  ): Promise<GenericResponse<PotentialOrder, "potentialOrder">> {
    const { id, payload } = arg;
    const url = `/${this.repo}/detail/${id}`;

    const { data } = await authApi.patch(url, payload);
    return data;
  }

  override async deleteMany(ids: string[]): Promise<HttpResponse> {
    const url = `/${this.repo}/multi`;

    const { data } = await authApi.delete(url, {
      data: { potentialOrderIds: ids },
    });
    return data;
  }

  override async delete(
    id: string,
  ): Promise<GenericResponse<PotentialOrder, "potentialOrder">> {
    const url = `/${this.repo}/detail/${id}`;

    const { data } = await authApi.delete(url);
    return data;
  }
}
