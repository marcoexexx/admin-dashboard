import AppError, { AppErrorKind } from "@/libs/exceptions";

import {
  CreateUserAddressInput,
  UpdateUserAddressInput,
} from "@/components/content/user-addresses/forms";
import { CacheResource } from "@/context/cacheKey";
import { UserAddressWhereInput } from "@/context/userAddress";
import { BaseApiService } from "./baseApiService";
import {
  Address,
  GenericResponse,
  HttpListResponse,
  HttpResponse,
  Pagination,
  QueryOptionArgs,
} from "./types";

import { authApi } from "./authApi";

export class UserAddressApiService
  extends BaseApiService<UserAddressWhereInput, Address>
{
  constructor(public repo: CacheResource) {
    super();
  }

  static new() {
    return new UserAddressApiService(CacheResource.UserAddress);
  }

  async findMany(
    opt: QueryOptionArgs,
    where: {
      filter?: UserAddressWhereInput["where"];
      pagination: Pagination;
      include?: UserAddressWhereInput["include"];
    },
  ): Promise<HttpListResponse<Address>> {
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

  async find(
    opt: QueryOptionArgs,
    where: {
      filter: { id: string | undefined; };
      include?: UserAddressWhereInput["include"];
    },
  ): Promise<GenericResponse<Address, "userAddress"> | undefined> {
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
    payload: CreateUserAddressInput,
  ): Promise<GenericResponse<Address, "userAddress">> {
    const url = `/${this.repo}`;

    const { data } = await authApi.post(url, payload);
    return data;
  }

  /**
   * Not Support yet!
   */
  async uploadExcel(
    _buf: ArrayBuffer,
  ): Promise<HttpListResponse<Address>> {
    return Promise.reject(
      AppError.new(AppErrorKind.ServiceUnavailable, `Not support yet!`),
    );
  }

  async update(
    arg: { id: string; payload: UpdateUserAddressInput; },
  ): Promise<GenericResponse<Address, "userAddress">> {
    const { id, payload } = arg;
    const url = `/${this.repo}/detail/${id}`;

    const { data } = await authApi.patch(url, payload);
    return data;
  }

  async deleteMany(ids: string[]): Promise<HttpResponse> {
    const url = `/${this.repo}/multi`;

    const { data } = await authApi.delete(url, {
      data: { userAddressIds: ids },
    });
    return data;
  }

  async delete(
    id: string,
  ): Promise<GenericResponse<Address, "userAddress">> {
    const url = `/${this.repo}/detail/${id}`;

    const { data } = await authApi.delete(url);
    return data;
  }
}
