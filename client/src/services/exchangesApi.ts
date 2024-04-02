import {
  CreateExchangeInput,
  UpdateExchangeInput,
} from "@/components/content/exchanges/forms";
import { CacheResource } from "@/context/cacheKey";
import { ExchangeWhereInput } from "@/context/exchange";
import { BaseApiService } from "./baseApiService";
import {
  Exchange,
  GenericResponse,
  HttpListResponse,
  HttpResponse,
  Pagination,
  QueryOptionArgs,
} from "./types";

import { authApi } from "./authApi";

export class ExchangeApiService
  extends BaseApiService<ExchangeWhereInput, Exchange>
{
  constructor(public repo: CacheResource) {
    super();
  }

  static new() {
    return new ExchangeApiService(CacheResource.Exchange);
  }

  override async findMany(
    opt: QueryOptionArgs,
    where: {
      filter?: ExchangeWhereInput["where"];
      pagination: Pagination;
      include?: ExchangeWhereInput["include"];
    },
  ): Promise<HttpListResponse<Exchange>> {
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
      include?: ExchangeWhereInput["include"];
    },
  ): Promise<GenericResponse<Exchange, "exchange"> | undefined> {
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
    payload: CreateExchangeInput,
  ): Promise<GenericResponse<Exchange, "brand">> {
    const url = `/${this.repo}`;

    const { data } = await authApi.post(url, payload);
    return data;
  }

  override async uploadExcel(
    buf: ArrayBuffer,
  ): Promise<HttpListResponse<Exchange>> {
    const url = `/${this.repo}/excel-upload`;

    const formData = new FormData();
    const blob = new Blob([buf], {
      type:
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    });

    formData.append("excel", blob, `Exchange_${Date.now()}.xlsx`);

    const { data } = await authApi.post(url, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });

    return data;
  }

  override async update(
    arg: { id: string; payload: UpdateExchangeInput; },
  ): Promise<GenericResponse<Exchange, "exchange">> {
    const { id, payload } = arg;
    const url = `/${this.repo}/detail/${id}`;

    const { data } = await authApi.patch(url, payload);
    return data;
  }

  override async deleteMany(ids: string[]): Promise<HttpResponse> {
    const url = `/${this.repo}/multi`;

    const { data } = await authApi.delete(url, {
      data: { exchangeIds: ids },
    });
    return data;
  }

  override async delete(
    id: string,
  ): Promise<GenericResponse<Exchange, "exchange">> {
    const url = `/${this.repo}/detail/${id}`;

    const { data } = await authApi.delete(url);
    return data;
  }
}
