import { CreateBrandInput, UpdateBrandInput } from "@/components/content/brands/forms";
import { BrandWhereInput } from "@/context/brand";
import { CacheResource } from "@/context/cacheKey";
import { authApi } from "./authApi";
import { BaseApiService } from "./baseApiService";
import { Brand, GenericResponse, HttpListResponse, HttpResponse, Pagination, QueryOptionArgs } from "./types";

export class BrandApiService extends BaseApiService<BrandWhereInput, Brand> {
  constructor(public repo: CacheResource) {
    super();
  }

  static new() {
    return new BrandApiService(CacheResource.Brand);
  }

  async findMany(
    opt: QueryOptionArgs,
    where: {
      filter?: BrandWhereInput["where"];
      pagination: Pagination;
      include?: BrandWhereInput["include"];
    },
  ): Promise<HttpListResponse<Brand>> {
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
      include?: BrandWhereInput["include"];
    },
  ): Promise<GenericResponse<Brand, "brand"> | undefined> {
    const { filter: { id }, include } = where;
    const url = `/${this.repo}/detail/${id}`;

    if (!id) return;
    const { data } = await authApi.get(url, {
      ...opt,
      params: { include },
    });
    return data;
  }

  async create(payload: CreateBrandInput): Promise<GenericResponse<Brand, "brand">> {
    const url = `/${this.repo}`;

    const { data } = await authApi.post(url, payload);
    return data;
  }

  async uploadExcel(buf: ArrayBuffer): Promise<HttpListResponse<Brand>> {
    const url = `/${this.repo}/excel-upload`;

    const formData = new FormData();
    const blob = new Blob([buf], { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" });

    formData.append("excel", blob, `Brands_${Date.now()}.xlsx`);

    const { data } = await authApi.post(url, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });

    return data;
  }

  async update(arg: { id: string; payload: UpdateBrandInput; }): Promise<GenericResponse<Brand, "brand">> {
    const { id, payload } = arg;
    const url = `/${this.repo}/detail/${id}`;

    const { data } = await authApi.patch(url, payload);
    return data;
  }

  async deleteMany(ids: string[]): Promise<HttpResponse> {
    const url = `/${this.repo}/multi`;

    const { data } = await authApi.delete(url, { data: { brandIds: ids } });
    return data;
  }

  async delete(id: string): Promise<GenericResponse<Brand, "brand">> {
    const url = `/${this.repo}/detail/${id}`;

    const { data } = await authApi.delete(url);
    return data;
  }
}
