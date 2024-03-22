import {
  Order,
  Pagination,
  PotentialOrder,
  WhereInput,
} from "@/services/types";

export type OrderWhereInput = {
  where?: WhereInput<Order>;
  pagination?: Pagination;
  include?: {
    user?: boolean;
    orderItems?: { include?: { product?: boolean; }; } | boolean;
    pickupAddress?: boolean;
    billingAddress?: boolean;
    deliveryAddress?: boolean;
  };
};

export type PotentialOrderWhereInput = {
  where?: WhereInput<PotentialOrder>;
  pagination?: Pagination;
  include?: {
    user?: boolean;
    orderItems?: { include?: { product?: boolean; }; } | boolean;
    pickupAddress?: boolean;
    billingAddress?: boolean;
    deliveryAddress?: boolean;
  };
};

export interface OrderFilterActions {
  type: "SET_ORDER_FILTER";
  payload: OrderWhereInput;
}

export interface PotentialOrderFilterActions {
  type: "SET_POTENTIAL_ORDER_FILTER";
  payload: PotentialOrderWhereInput;
}

export interface ChangeOrderPageActions {
  type: "SET_ORDER_PAGE";
  payload: number;
}

export interface ChangeOrderPageSizeActions {
  type: "SET_ORDER_PAGE_SIZE";
  payload: number;
}

export interface ChangePotentialOrderPageActions {
  type: "SET_POTENTIAL_ORDER_PAGE";
  payload: number;
}

export interface ChangePotentialOrderPageSizeActions {
  type: "SET_POTENTIAL_ORDER_PAGE_SIZE";
  payload: number;
}
