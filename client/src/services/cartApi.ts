import {
  CreateCartOrderItemInput,
  UpdateCartOrderItemInput,
} from "@/components/cart/CartsTable";
import { CacheResource } from "@/context/cacheKey";
import { CartWhereInput } from "@/context/cart";
import { authApi } from "./authApi";
import { BaseApiService } from "./baseApiService";
import {
  Cart,
  GenericResponse,
  OrderItem,
  QueryOptionArgs,
} from "./types";

export class CartApiService extends BaseApiService<CartWhereInput, Cart> {
  constructor(public repo: CacheResource) {
    super();
  }

  static new() {
    return new CartApiService(CacheResource.Cart);
  }

  async find(
    opt: QueryOptionArgs,
    where: {
      filter: { id: string | undefined; };
      include?: CartWhereInput["include"];
    },
  ): Promise<GenericResponse<Cart, "cart"> | undefined> {
    const { filter: { id }, include } = where;
    const url = `/${this.repo}/detail/${id}`;

    if (!id) return;
    const { data } = await authApi.get(url, {
      ...opt,
      params: { include },
    });
    return data;
  }

  async createCartOrderItem(
    payload: CreateCartOrderItemInput,
  ): Promise<GenericResponse<OrderItem, "orderItem">> {
    const url = `/${this.repo}`;

    const { data } = await authApi.post(url, payload);
    return data;
  }

  async delete(id: string): Promise<GenericResponse<Cart, "cart">> {
    const url = `/${this.repo}/detail/${id}`;

    const { data } = await authApi.delete(url);
    return data;
  }

  async deleteSingleItem(
    itemId: string,
  ): Promise<GenericResponse<OrderItem, "orderItem">> {
    const url = `/${this.repo}/orderItems/detail/${itemId}`;

    const { data } = await authApi.delete(url);
    return data;
  }

  async update(
    arg: { id: string; payload: UpdateCartOrderItemInput; },
  ): Promise<GenericResponse<OrderItem, "orderItem">> {
    const { id, payload } = arg;
    const url = `/${this.repo}/orderItems/detail/${id}`;

    const { data } = await authApi.patch(url, payload);
    return data;
  }
}
