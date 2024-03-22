import { CreateCouponInput, UpdateCouponInput } from "@/components/content/coupons/forms";
import { CacheResource } from "@/context/cacheKey";
import { CouponWhereInput } from "@/context/coupon";
import { BaseApiService } from "./baseApiService";
import {
  Coupon,
  GenericResponse,
  HttpListResponse,
  HttpResponse,
  Pagination,
  QueryOptionArgs,
} from "./types";

import { authApi } from "./authApi";

export class CouponApiService extends BaseApiService<CouponWhereInput, Coupon> {
  constructor(public repo: CacheResource) {
    super();
  }

  static new() {
    return new CouponApiService(CacheResource.Coupon);
  }

  async findMany(
    opt: QueryOptionArgs,
    where: {
      filter?: CouponWhereInput["where"];
      pagination: Pagination;
      include?: CouponWhereInput["include"];
      orderBy?: Record<keyof Coupon, any>;
    },
  ): Promise<HttpListResponse<Coupon>> {
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
      include?: CouponWhereInput["include"];
    },
  ): Promise<GenericResponse<Coupon, "coupon"> | undefined> {
    const { filter: { id }, include } = where;
    const url = `/${this.repo}/detail/${id}`;

    if (!id) return;
    const { data } = await authApi.get(url, {
      ...opt,
      params: { include },
    });
    return data;
  }

  async create(payload: CreateCouponInput): Promise<GenericResponse<Coupon, "coupon">> {
    const url = `/${this.repo}`;

    const { data } = await authApi.post(url, payload);
    return data;
  }

  async uploadExcel(buf: ArrayBuffer): Promise<HttpListResponse<Coupon>> {
    const url = `/${this.repo}/excel-upload`;

    const formData = new FormData();
    const blob = new Blob([buf], {
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    });

    formData.append("excel", blob, `Coupons_${Date.now()}.xlsx`);

    const { data } = await authApi.post(url, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });

    return data;
  }

  async update(
    arg: { id: string; payload: UpdateCouponInput; },
  ): Promise<GenericResponse<Coupon, "coupon">> {
    const { id, payload } = arg;
    const url = `/${this.repo}/detail/${id}`;

    const { data } = await authApi.patch(url, payload);
    return data;
  }

  async deleteMany(ids: string[]): Promise<HttpResponse> {
    const url = `/${this.repo}/multi`;

    const { data } = await authApi.delete(url, { data: { couponIds: ids } });
    return data;
  }

  async delete(id: string): Promise<GenericResponse<Coupon, "coupon">> {
    const url = `/${this.repo}/detail/${id}`;

    const { data } = await authApi.delete(url);
    return data;
  }
}
