import { Address, Pagination, WhereInput } from "@/services/types";

export type UserAddressWhereInput = {
  where?: WhereInput<Address>;
  pagination?: Pagination;
  include?: {
    _count?: boolean;
    region?: boolean;
    user?: boolean;
    township?: boolean;
    deliveryOrders?: boolean;
    deveryPotentialOrders?: boolean;
    billingOrders?: boolean;
    billingPotentialOrders?: boolean;
  };
};

export interface UserAddressFilterActions {
  type: "SET_USER_ADDRESS_FILTER";
  payload: UserAddressWhereInput;
}

export interface ChangeUserAddressPageActions {
  type: "SET_USER_ADDRESS_PAGE";
  payload: number;
}

export interface ChangeUserAddressPageSizeActions {
  type: "SET_USER_ADDRESS_PAGE_SIZE";
  payload: number;
}
