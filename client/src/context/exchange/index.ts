import { Exchange, Pagination, WhereInput } from "@/services/types";

export type ExchangeWhereInput = {
  where?: WhereInput<
    Exchange & { startDate?: Date | string; endDate?: Date | string; }
  >;
  pagination?: Pagination;
  include?: {
    shopowner?: boolean;
  };
};

export interface ExchangeFilterActions {
  type: "SET_EXCHANGE_FILTER";
  payload: ExchangeWhereInput;
}

export interface ChangeExchangePageActions {
  type: "SET_EXCHANGE_PAGE";
  payload: number;
}

export interface ChangeExchangePageSizeActions {
  type: "SET_EXCHANGE_PAGE_SIZE";
  payload: number;
}
