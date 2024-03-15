import { Pagination, ShopownerProvider, WhereInput } from "@/services/types";

export type ShopownerProviderWhereInput = {
  where?: WhereInput<ShopownerProvider>;
  pagination?: Pagination;
  include?: {
    _count?: boolean;
    users?: boolean;
    exchanges?: boolean;
  };
};

export interface ShopownerProviderFilterActions {
  type: "SET_SHOPOWNER_FILTER";
  payload: ShopownerProviderWhereInput;
}

export interface ChangeShopownerProviderPageActions {
  type: "SET_SHOPOWNER_PAGE";
  payload: number;
}

export interface ChangeShopownerProviderPageSizeActions {
  type: "SET_SHOPOWNER_PAGE_SIZE";
  payload: number;
}
