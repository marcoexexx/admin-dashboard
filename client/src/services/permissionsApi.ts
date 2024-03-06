import { GenericResponse, HttpListResponse, HttpResponse, Pagination, Permission, QueryOptionArgs } from "./types";
import { BaseApiService } from "./baseApiService";
import { CacheResource } from "@/context/cacheKey";
import { PermissionWhereInput } from "@/context/permission";
import { CreatePermissionInput, UpdatePermissionInput } from "@/components/content/permissions/forms";
import { authApi } from "./authApi";


export class PermisssionApiService extends BaseApiService<PermissionWhereInput, Permission> {
  constructor(public repo: CacheResource) { super() }

  static new() {
    return new PermisssionApiService(CacheResource.Permission)
  }


  async findMany(
    opt: QueryOptionArgs,
    where: {
      filter?: PermissionWhereInput["where"];
      pagination: Pagination;
      include?: PermissionWhereInput["include"];
    }
  ): Promise<HttpListResponse<Permission>> {
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
      include?: PermissionWhereInput["include"];
    }
  ): Promise<GenericResponse<Permission, "permission"> | undefined> {
    const { filter: { id }, include } = where
    const url = `/${this.repo}/detail/${id}`

    if (!id) return
    const { data } = await authApi.get(url, {
      ...opt,
      params: { include }
    })
    return data
  }


  async create(payload: CreatePermissionInput): Promise<GenericResponse<Permission, "permission">> {
    const url = `/${this.repo}`

    const { data } = await authApi.post(url, payload)
    return data
  }


  async update(arg: { id: string; payload: UpdatePermissionInput }): Promise<GenericResponse<Permission, "permission">> {
    const { id, payload } = arg
    const url = `/${this.repo}/detail/${id}`

    const { data } = await authApi.patch(url, payload)
    return data
  }


  async deleteMany(ids: string[]): Promise<HttpResponse> {
    const url = `/${this.repo}/multi`

    const { data } = await authApi.delete(url, { data: { permissionIds: ids } })
    return data
  }


  async delete(id: string): Promise<GenericResponse<Permission, "permission">> {
    const url = `/${this.repo}/detail/${id}`

    const { data } = await authApi.delete(url)
    return data
  }
}

