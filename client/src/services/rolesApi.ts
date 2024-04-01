import {
  CreateRoleInput,
  UpdateRoleInput,
} from "@/components/content/roles/forms";
import { CacheResource } from "@/context/cacheKey";
import { RoleWhereInput } from "@/context/role";
import { authApi } from "./authApi";
import { BaseApiService } from "./baseApiService";
import {
  GenericResponse,
  HttpListResponse,
  HttpResponse,
  Pagination,
  QueryOptionArgs,
  Role,
} from "./types";

export class RoleApiService extends BaseApiService<RoleWhereInput, Role> {
  constructor(public repo: CacheResource) {
    super();
  }

  static new() {
    return new RoleApiService(CacheResource.Role);
  }

  async findMany(
    opt: QueryOptionArgs,
    where: {
      filter?: RoleWhereInput["where"];
      pagination: Pagination;
      include?: RoleWhereInput["include"];
    },
  ): Promise<HttpListResponse<Role>> {
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
      include?: RoleWhereInput["include"];
    },
  ): Promise<GenericResponse<Role, "role"> | undefined> {
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
    payload: CreateRoleInput,
  ): Promise<GenericResponse<Role, "role">> {
    const url = `/${this.repo}`;

    const { data } = await authApi.post(url, payload);
    return data;
  }

  async uploadExcel(buf: ArrayBuffer): Promise<HttpListResponse<Role>> {
    const url = `/${this.repo}/excel-upload`;

    const formData = new FormData();
    const blob = new Blob([buf], {
      type:
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    });

    formData.append("excel", blob, `Roles_${Date.now()}.xlsx`);

    const { data } = await authApi.post(url, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });

    return data;
  }

  async update(
    arg: { id: string; payload: UpdateRoleInput; },
  ): Promise<GenericResponse<Role, "role">> {
    const { id, payload } = arg;
    const url = `/${this.repo}/detail/${id}`;

    const { data } = await authApi.patch(url, payload);
    return data;
  }

  async deleteMany(ids: string[]): Promise<HttpResponse> {
    const url = `/${this.repo}/multi`;

    const { data } = await authApi.delete(url, { data: { roleIds: ids } });
    return data;
  }

  async delete(id: string): Promise<GenericResponse<Role, "role">> {
    const url = `/${this.repo}/detail/${id}`;

    const { data } = await authApi.delete(url);
    return data;
  }
}
