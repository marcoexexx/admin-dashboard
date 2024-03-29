import {
  CreateRegionInput,
  UpdateRegionInput,
} from "@/components/content/regions/forms";
import { CacheResource } from "@/context/cacheKey";
import { RegionWhereInput } from "@/context/region";
import { authApi } from "./authApi";
import { BaseApiService } from "./baseApiService";
import {
  GenericResponse,
  HttpListResponse,
  HttpResponse,
  Pagination,
  QueryOptionArgs,
  Region,
} from "./types";

export class RegionApiService
  extends BaseApiService<RegionWhereInput, Region>
{
  constructor(public repo: CacheResource) {
    super();
  }

  static new() {
    return new RegionApiService(CacheResource.Region);
  }

  async findMany(
    opt: QueryOptionArgs,
    where: {
      filter?: RegionWhereInput["where"];
      pagination: Pagination;
      include?: RegionWhereInput["include"];
    },
  ): Promise<HttpListResponse<Region>> {
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
      include?: RegionWhereInput["include"];
    },
  ): Promise<GenericResponse<Region, "region"> | undefined> {
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
    payload: CreateRegionInput,
  ): Promise<GenericResponse<Region, "region">> {
    const url = `/${this.repo}`;

    const { data } = await authApi.post(url, payload);
    return data;
  }

  async uploadExcel(buf: ArrayBuffer): Promise<HttpListResponse<Region>> {
    const url = `/${this.repo}/excel-upload`;

    const formData = new FormData();
    const blob = new Blob([buf], {
      type:
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    });

    formData.append("excel", blob, `Regions_${Date.now()}.xlsx`);

    const { data } = await authApi.post(url, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });

    return data;
  }

  async update(
    arg: { id: string; payload: UpdateRegionInput; },
  ): Promise<GenericResponse<Region, "region">> {
    const { id, payload } = arg;
    const url = `/${this.repo}/detail/${id}`;

    const { data } = await authApi.patch(url, payload);
    return data;
  }

  async deleteMany(ids: string[]): Promise<HttpResponse> {
    const url = `/${this.repo}/multi`;

    const { data } = await authApi.delete(url, {
      data: { regionIds: ids },
    });
    return data;
  }

  async delete(id: string): Promise<GenericResponse<Region, "region">> {
    const url = `/${this.repo}/detail/${id}`;

    const { data } = await authApi.delete(url);
    return data;
  }
}
