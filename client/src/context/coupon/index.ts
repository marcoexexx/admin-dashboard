import { Coupon, Pagination, WhereInput } from "@/services/types";

export type CouponWhereInput = {
  where?: WhereInput<Coupon>;
  pagination?: Pagination;
  include?: {
    reward?: boolean;
    product?: boolean;
  };
};

export interface CouponFilterActions {
  type: "SET_COUPON_FILTER";
  payload: CouponWhereInput;
}

export interface ChangeCouponPageActions {
  type: "SET_COUPON_PAGE";
  payload: number;
}

export interface ChangeCouponPageSizeActions {
  type: "SET_COUPON_PAGE_SIZE";
  payload: number;
}
