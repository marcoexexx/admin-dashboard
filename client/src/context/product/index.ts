import { Pagination, Product, WhereInput } from "@/services/types";

export type ProductWhereInput = {
  where?: WhereInput<Product>;
  pagination?: Pagination;
  include?: {
    _count?: boolean;
    likedUsers?: boolean;
    brand?: boolean;
    specification?: boolean;
    categories?: {
      include?: {
        category?: boolean;
        product?: boolean;
      };
    };
    salesCategory?: {
      include?: {
        salesCategory?: boolean;
        product?: boolean;
      };
    };
    reviews?: boolean;
    creator?: boolean;
  };
};

export interface ProductFilterActions {
  type: "SET_PRODUCT_FILTER";
  payload: ProductWhereInput;
}

export interface ChangeProductPageActions {
  type: "SET_PRODUCT_PAGE";
  payload: number;
}

export interface ChangeProductPageSizeActions {
  type: "SET_PRODUCT_PAGE_SIZE";
  payload: number;
}
