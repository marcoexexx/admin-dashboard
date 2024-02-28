import { Cart, GenericResponse, OrderItem, QueryOptionArgs } from "./types";
import { BaseApiService } from "./baseApiService";
import { CacheResource } from "@/context/cacheKey";
import { CartWhereInput } from "@/context/cart";
import { CreateCartInput } from "@/components/cart/CartsTable";
import { authApi } from "./authApi";


export class CartApiService extends BaseApiService<CartWhereInput, Cart> {
  constructor(public repo: CacheResource) { super() }

  static new() {
    return new CartApiService(CacheResource.Cart)
  }


  async find(
    opt: QueryOptionArgs,
    where: {
      filter: { id: string | undefined };
      include?: CartWhereInput["include"];
    }
  ): Promise<GenericResponse<Cart, "cart"> | undefined> {
    const { filter: { id }, include } = where
    const url = `/${this.repo}/detail/${id}`

    if (!id) return
    const { data } = await authApi.get(url, {
      ...opt,
      params: { include }
    })
    return data
  }


  async initialize(payload: CreateCartInput): Promise<GenericResponse<Cart, "cart">> {
    const url = `/${this.repo}`

    const { data } = await authApi.post(url, payload)
    return data
  }


  async delete(id: string): Promise<GenericResponse<Cart, "cart">> {
    const url = `/${this.repo}/detail/${id}`

    const { data } = await authApi.delete(url)
    return data
  }


  async deleteSingleItem(itemId: string): Promise<GenericResponse<OrderItem, "orderItem">> {
    const url = `/${this.repo}/orderItems/detail/${itemId}`

    const { data } = await authApi.delete(url)
    return data
  }
}

