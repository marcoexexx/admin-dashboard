import {
  CreateProductInput,
  UpdateProductInput,
} from "@/components/content/products/forms";
import { CacheResource } from "@/context/cacheKey";
import { ProductWhereInput } from "@/context/product";
import { authApi } from "./authApi";
import { BaseApiService } from "./baseApiService";
import {
  GenericResponse,
  HttpListResponse,
  HttpResponse,
  Pagination,
  Product,
  ProductSalesCategoriesResponse,
  QueryOptionArgs,
} from "./types";

export class ProductApiService
  extends BaseApiService<ProductWhereInput, Product>
{
  constructor(public repo: CacheResource) {
    super();
  }

  static new() {
    return new ProductApiService(CacheResource.Product);
  }

  async findMany(
    opt: QueryOptionArgs,
    where: {
      filter?: ProductWhereInput["where"];
      pagination: Pagination;
      include?: ProductWhereInput["include"];
    },
  ): Promise<HttpListResponse<Product>> {
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
      include?: ProductWhereInput["include"];
    },
  ): Promise<GenericResponse<Product, "product"> | undefined> {
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
    payload: CreateProductInput,
  ): Promise<GenericResponse<Product, "product">> {
    const url = `/${this.repo}`;

    const { data } = await authApi.post(url, payload);
    return data;
  }

  async uploadExcel(buf: ArrayBuffer): Promise<HttpListResponse<Product>> {
    const url = `/${this.repo}/excel-upload`;

    const formData = new FormData();
    const blob = new Blob([buf], {
      type:
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    });

    formData.append("excel", blob, `Products_${Date.now()}.xlsx`);

    const { data } = await authApi.post(url, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });

    return data;
  }

  async update(
    arg: { id: string; payload: UpdateProductInput; },
  ): Promise<GenericResponse<Product, "product">> {
    const { id, payload } = arg;
    const url = `/${this.repo}/detail/${id}`;

    const { data } = await authApi.patch(url, payload);
    return data;
  }

  async deleteMany(ids: string[]): Promise<HttpResponse> {
    const url = `/${this.repo}/multi`;

    const { data } = await authApi.delete(url, {
      data: { productIds: ids },
    });
    return data;
  }

  async delete(id: string): Promise<GenericResponse<Product, "product">> {
    const url = `/${this.repo}/detail/${id}`;

    const { data } = await authApi.delete(url);
    return data;
  }

  async findManySaleCategories(
    opt: QueryOptionArgs,
    { productId }: { productId: string | undefined; },
  ): Promise<
    HttpListResponse<ProductSalesCategoriesResponse> | undefined
  > {
    const url = `/${this.repo}/detail/${productId}/sales`;

    if (!productId) return;
    const { data } = await authApi.get(url, {
      ...opt,
    });
    return data;
  }

  async createSaleCategory(
    { productId, salesCategoryId, discount }: {
      productId: string;
      salesCategoryId: string;
      discount: number;
    },
  ): Promise<
    GenericResponse<ProductSalesCategoriesResponse, "category"> | undefined
  > {
    const url = `/${this.repo}/detail/${productId}/sales`;

    if (!productId && !salesCategoryId) return;
    const res = await authApi.post(url, { salesCategoryId, discount });
    return res.data;
  }

  async deleteSaleCategory(
    { productId, productSaleCategoryId }: {
      productId: string;
      productSaleCategoryId: string;
    },
  ): Promise<HttpResponse | undefined> {
    const url =
      `/${this.repo}/detail/${productId}/sales/detail/${productSaleCategoryId}`;

    if (!productId) return;
    const res = await authApi.delete(url);
    return res.data;
  }

  async updateSaleCategory(
    { productId, productSaleCategoryId, discount }: {
      productId: string;
      productSaleCategoryId: string;
      discount: number;
    },
  ): Promise<
    | GenericResponse<
      ProductSalesCategoriesResponse,
      "productSalesCategory"
    >
    | undefined
  > {
    const url =
      `/${this.repo}/detail/${productId}/sales/detail/${productSaleCategoryId}`;

    if (!productId && !productSaleCategoryId) return;
    const res = await authApi.patch(url, { discount });
    return res.data;
  }

  async like(
    { userId, productId }: { userId: string; productId: string; },
  ): Promise<GenericResponse<Product, "product"> | undefined> {
    const url = `/${this.repo}/like/${productId}`;

    const res = await authApi.patch(url, { userId });
    return res.data;
  }

  async unlike(
    { userId, productId }: { userId: string; productId: string; },
  ): Promise<HttpResponse> {
    const url = `/${this.repo}/unlike/${productId}`;

    const res = await authApi.patch(url, { userId });
    return res.data;
  }
}
