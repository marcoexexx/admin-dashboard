import {
  CreateOrderInput,
  UpdateOrderInput,
} from "@/components/content/orders/forms";
import { CacheResource } from "@/context/cacheKey";
import { OrderWhereInput } from "@/context/order";
import { authApi } from "./authApi";
import { BaseApiService } from "./baseApiService";
import {
  GenericResponse,
  HttpListResponse,
  HttpResponse,
  Order,
  Pagination,
  QueryOptionArgs,
} from "./types";

export class OrderApiService
  extends BaseApiService<OrderWhereInput, Order>
{
  constructor(public repo: CacheResource) {
    super();
  }

  static new() {
    return new OrderApiService(CacheResource.Order);
  }

  async findMany(
    opt: QueryOptionArgs,
    where: {
      filter?: OrderWhereInput["where"];
      pagination: Pagination;
      include?: OrderWhereInput["include"];
    },
  ): Promise<HttpListResponse<Order>> {
    const url = `/${this.repo}`;
    const { filter, pagination, include } = where;

    const { data } = await authApi.get(url, {
      ...opt,
      params: {
        filter,
        pagination,
        include,
        orderBy: {
          updatedAt: "desc",
        },
      },
    });
    return data;
  }

  async find(
    opt: QueryOptionArgs,
    where: {
      filter: { id: string | undefined; };
      include?: OrderWhereInput["include"];
    },
  ): Promise<GenericResponse<Order, "order"> | undefined> {
    const { filter: { id }, include } = where;
    const url = `/${this.repo}/detail/${id}`;

    if (!id) return;
    const { data } = await authApi.get(url, {
      ...opt,
      params: { include },
    });
    return data;
  }

  async create(
    payload: CreateOrderInput,
  ): Promise<GenericResponse<Order, "order">> {
    const url = `/${this.repo}`;

    const { data } = await authApi.post(url, payload);
    return data;
  }

  async uploadExcel(buf: ArrayBuffer): Promise<HttpListResponse<Order>> {
    const url = `/${this.repo}/excel-upload`;

    const formData = new FormData();
    const blob = new Blob([buf], {
      type:
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    });

    formData.append("excel", blob, `Orders_${Date.now()}.xlsx`);

    const { data } = await authApi.post(url, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });

    return data;
  }

  async update(
    arg: { id: string; payload: UpdateOrderInput; },
  ): Promise<GenericResponse<Order, "order">> {
    const { id, payload } = arg;
    const url = `/${this.repo}/detail/${id}`;

    const { data } = await authApi.patch(url, payload);
    return data;
  }

  async deleteMany(ids: string[]): Promise<HttpResponse> {
    const url = `/${this.repo}/multi`;

    const { data } = await authApi.delete(url, {
      data: { orderIds: ids },
    });
    return data;
  }

  async delete(id: string): Promise<GenericResponse<Order, "order">> {
    const url = `/${this.repo}/detail/${id}`;

    const { data } = await authApi.delete(url);
    return data;
  }
}
