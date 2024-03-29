import { i18n, Local } from "@/i18n";
import { Pagination, User } from "@/services/types";
import { createContext, useReducer } from "react";

import AppError, { AppErrorKind } from "@/libs/exceptions";
import { SnackbarOrigin } from "@mui/material";
import {
  AccessLogFilterActions,
  AccessLogWhereInput,
  ChangeAccessLogPageActions,
  ChangeAccessLogPageSizeActions,
} from "./accessLog";
import {
  AllModalFormCloseActions,
  CloseBackdropActions,
  DisableCheckOutActions,
  EnableCheckOutActions,
  LocalActions,
  ModalFormCloseActions,
  ModalFormOpenActions,
  OpenBackdropActions,
  SlidebarCloseActions,
  SlidebarOpenActions,
  SlidebarToggleActions,
  ThemeActions,
  ToastCloseActions,
  ToastOpenActions,
  ToggleBackdropActions,
  UserActions,
} from "./actions";
import {
  AuditLogFilterActions,
  AuditLogWhereInput,
  ChangeAuditLogPageActions,
  ChangeAuditLogPageSizeActions,
} from "./auditLogs";
import {
  BrandFilterActions,
  BrandWhereInput,
  ChangeBrandPageActions,
  ChangeBrandPageSizeActions,
} from "./brand";
import { CacheResource } from "./cacheKey";
import {
  CategoryFilterActions,
  CategoryWhereInput,
  ChangeCategoryPageActions,
  ChangeCategoryPageSizeActions,
} from "./category";
import {
  ChangeCouponPageActions,
  ChangeCouponPageSizeActions,
  CouponFilterActions,
  CouponWhereInput,
} from "./coupon";
import {
  ChangeExchangePageActions,
  ChangeExchangePageSizeActions,
  ExchangeFilterActions,
  ExchangeWhereInput,
} from "./exchange";
import {
  ChangeOrderPageActions,
  ChangeOrderPageSizeActions,
  ChangePotentialOrderPageActions,
  ChangePotentialOrderPageSizeActions,
  OrderFilterActions,
  OrderWhereInput,
  PotentialOrderFilterActions,
  PotentialOrderWhereInput,
} from "./order";
import {
  ChangePermissionPageActions,
  ChangePermissionPageSizeActions,
  PermissionFilterActions,
  PermissionWhereInput,
} from "./permission";
import {
  ChangePickupPageActions,
  ChangePickupPageSizeActions,
  PickupAddressFilterActions,
  PickupAddressWhereInput,
} from "./pickupAddress";
import {
  ChangeProductPageActions,
  ChangeProductPageSizeActions,
  ProductFilterActions,
  ProductWhereInput,
} from "./product";
import {
  ChangeRegionPageActions,
  ChangeRegionPageSizeActions,
  RegionFilterActions,
  RegionWhereInput,
} from "./region";
import {
  ChangeRolePageActions,
  ChangeRolePageSizeActions,
  RoleFilterActions,
  RoleWhereInput,
} from "./role";
import {
  ChangeSalesCategoryPageActions,
  ChangeSalesCategoryPageSizeActions,
  SalesCategoryFilterActions,
  SalesCategoryWhereInput,
} from "./salesCategory";
import {
  ChangeShopownerProviderPageActions,
  ChangeShopownerProviderPageSizeActions,
  ShopownerProviderFilterActions,
  ShopownerProviderWhereInput,
} from "./shopowner";
import {
  ChangeTownshipPageActions,
  ChangeTownshipPageSizeActions,
  TownshipFilterActions,
  TownshipWhereInput,
} from "./township";
import {
  ChangeUserPageActions,
  ChangeUserPageSizeActions,
  UserFilterActions,
  UserWhereInput,
} from "./user";
import {
  ChangeUserAddressPageActions,
  ChangeUserAddressPageSizeActions,
  UserAddressFilterActions,
  UserAddressWhereInput,
} from "./userAddress";

const INITIAL_LIST_PAGE_LIMIT = 10;
export const INITIAL_PAGINATION: Pagination = {
  page: 1,
  pageSize: INITIAL_LIST_PAGE_LIMIT,
};

type Singular<T> = T extends `${infer Y}ies` ? `${Y}y`
  // : T extends `${infer S}es` ? S
  : T extends `${infer U}s` ? U
  : never;

export type ModalFormField =
  | "*"
  | "delete-specification"
  | "cart"
  | `create-${Singular<CacheResource>}`
  | `delete-${Singular<CacheResource>}`
  | `delete-${CacheResource}-multi`
  | `excel-${CacheResource}`;

export type Store = {
  theme:
    | "light"
    | "dark";
  toast: {
    status: boolean;
    message?: string;
    anchorOrigin?: SnackbarOrigin;
    severity:
      | "success"
      | "error"
      | "warning"
      | "info";
  };
  modalForm: {
    // TODO: multi create exel modal
    field: ModalFormField;
    state: boolean;
  };
  user: User | undefined;
  slidebar: boolean;
  backdrop: boolean;
  local: Local;
  roleFilter: RoleWhereInput;
  permissionFilter: PermissionWhereInput;
  shopownerFilter: ShopownerProviderWhereInput;
  accessLogFilter: AccessLogWhereInput;
  auditLogFilter: AuditLogWhereInput;
  orderFilter: OrderWhereInput;
  potentialOrderFilter: PotentialOrderWhereInput;
  userFilter: UserWhereInput;
  userAddressFilter: UserAddressWhereInput;
  pickupAddressFilter: PickupAddressWhereInput;
  productFilter: ProductWhereInput;
  salesCategoryFilter: SalesCategoryWhereInput;
  categoryFilter: CategoryWhereInput;
  brandFilter: BrandWhereInput;
  townshipFilter: TownshipWhereInput;
  regionFilter: RegionWhereInput;
  exchangeFilter: ExchangeWhereInput;
  couponFilter: CouponWhereInput;
  disableCheckOut: boolean;
};

type Action =
  | ThemeActions
  | ToastOpenActions
  | ToastCloseActions
  | UserActions
  | LocalActions
  | SlidebarOpenActions
  | SlidebarToggleActions
  | SlidebarCloseActions
  | OpenBackdropActions
  | CloseBackdropActions
  | ToggleBackdropActions
  // Resources
  | AccessLogFilterActions
  | ChangeAccessLogPageActions
  | ChangeAccessLogPageSizeActions
  | AuditLogFilterActions
  | ChangeAuditLogPageActions
  | ChangeAuditLogPageSizeActions
  | BrandFilterActions
  | ChangeBrandPageActions
  | ChangeBrandPageSizeActions
  | CategoryFilterActions
  | ChangeCategoryPageActions
  | ChangeCategoryPageSizeActions
  | CouponFilterActions
  | ChangeCouponPageActions
  | ChangeCouponPageSizeActions
  | ExchangeFilterActions
  | ChangeExchangePageActions
  | ChangeExchangePageSizeActions
  | OrderFilterActions
  | ChangeOrderPageActions
  | ChangeOrderPageSizeActions
  | PotentialOrderFilterActions
  | ChangePotentialOrderPageActions
  | ChangePotentialOrderPageSizeActions
  | PickupAddressFilterActions
  | ChangePickupPageActions
  | ChangePickupPageSizeActions
  | ProductFilterActions
  | ChangeProductPageActions
  | ChangeProductPageSizeActions
  | RegionFilterActions
  | ChangeRegionPageActions
  | ChangeRegionPageSizeActions
  | SalesCategoryFilterActions
  | ChangeSalesCategoryPageActions
  | ChangeSalesCategoryPageSizeActions
  | TownshipFilterActions
  | ChangeTownshipPageActions
  | ChangeTownshipPageSizeActions
  | UserFilterActions
  | ChangeUserPageActions
  | ChangeUserPageSizeActions
  | UserAddressFilterActions
  | ChangeUserAddressPageActions
  | ChangeUserAddressPageSizeActions
  | RoleFilterActions
  | ChangeRolePageActions
  | ChangeRolePageSizeActions
  | PermissionFilterActions
  | ChangePermissionPageActions
  | ChangePermissionPageSizeActions
  | ShopownerProviderFilterActions
  | ChangeShopownerProviderPageActions
  | ChangeShopownerProviderPageSizeActions
  | ModalFormOpenActions
  | ModalFormCloseActions
  | AllModalFormCloseActions
  | DisableCheckOutActions
  | EnableCheckOutActions;

type Dispatch = (action: Action) => void;

export const StoreContext = createContext<
  { state: Store; dispatch: Dispatch; } | undefined
>(undefined);

const initialState: Store = {
  user: undefined,
  theme: localStorage.getItem("theme") as Store["theme"] || "light",
  toast: {
    anchorOrigin: { vertical: "top", horizontal: "left" },
    status: false,
    severity: "info",
  },
  local: i18n.local,
  slidebar: false,
  backdrop: false,
  modalForm: {
    field: "*",
    state: false,
  },
  shopownerFilter: {
    pagination: INITIAL_PAGINATION,
  },
  permissionFilter: {
    pagination: INITIAL_PAGINATION,
  },
  roleFilter: {
    pagination: INITIAL_PAGINATION,
  },
  auditLogFilter: {
    pagination: INITIAL_PAGINATION,
  },
  accessLogFilter: {
    pagination: INITIAL_PAGINATION,
  },
  orderFilter: {
    pagination: INITIAL_PAGINATION,
  },
  potentialOrderFilter: {
    pagination: INITIAL_PAGINATION,
  },
  userFilter: {
    pagination: INITIAL_PAGINATION,
  },
  userAddressFilter: {
    pagination: INITIAL_PAGINATION,
  },
  pickupAddressFilter: {
    pagination: INITIAL_PAGINATION,
  },
  townshipFilter: {
    pagination: INITIAL_PAGINATION,
  },
  regionFilter: {
    pagination: INITIAL_PAGINATION,
  },
  exchangeFilter: {
    pagination: INITIAL_PAGINATION,
  },
  couponFilter: {
    pagination: INITIAL_PAGINATION,
  },
  brandFilter: {
    pagination: INITIAL_PAGINATION,
  },
  categoryFilter: {
    pagination: INITIAL_PAGINATION,
  },
  salesCategoryFilter: {
    pagination: INITIAL_PAGINATION,
  },
  productFilter: {
    pagination: INITIAL_PAGINATION,
    include: {
      _count: false,
      specification: false,
      brand: true,
      categories: {
        include: {
          category: true,
        },
      },
      salesCategory: {
        include: {
          salesCategory: true,
        },
      },
    },
  },

  disableCheckOut: true,
};

const stateReducer = (state: Store, action: Action): Store => {
  switch (action.type) {
    case "TOGGLE_THEME": {
      const theme = state.theme === "light" ? "dark" : "light";
      localStorage.setItem("theme", theme);
      return { ...state, theme };
    }

    case "OPEN_TOAST": {
      return {
        ...state,
        toast: { ...state.toast, status: true, ...action.payload },
      };
    }

    case "CLOSE_TOAST": {
      return { ...state, toast: { ...state.toast, status: false } };
    }

    case "OPEN_BACKDROP": {
      return { ...state, backdrop: true };
    }

    case "CLOSE_BACKDROP": {
      return { ...state, backdrop: false };
    }

    case "TOGGLE_BACKDROP": {
      return { ...state, backdrop: !state.backdrop };
    }

    case "SET_USER": {
      return { ...state, user: action.payload };
    }

    case "SET_LOCAL": {
      i18n.load(action.payload);
      return { ...state, local: action.payload };
    }

    case "OPEN_SLIDEBAR": {
      return { ...state, slidebar: true };
    }

    case "TOGGLE_SLIDEBAR": {
      return { ...state, slidebar: !state.slidebar };
    }

    case "CLOSE_SLIDEBAR": {
      return { ...state, slidebar: false };
    }

    case "OPEN_MODAL_FORM": {
      return {
        ...state,
        modalForm: { state: true, field: action.payload },
      };
    }

    case "CLOSE_MODAL_FORM": {
      return {
        ...state,
        modalForm: { state: false, field: action.payload },
      };
    }

    case "CLOSE_ALL_MODAL_FORM": {
      return { ...state, modalForm: { state: false, field: "*" } };
    }

    case "SET_USER_FILTER": {
      return {
        ...state,
        userFilter: {
          ...state.userFilter,
          ...action.payload,
        },
      };
    }
    case "SET_USER_PAGE": {
      return {
        ...state,
        userFilter: {
          ...state.userFilter,
          pagination: {
            pageSize: state.userFilter.pagination?.pageSize
              || INITIAL_PAGINATION.pageSize,
            page: action.payload,
          },
        },
      };
    }
    case "SET_USER_PAGE_SIZE": {
      return {
        ...state,
        userFilter: {
          ...state.userFilter,
          pagination: {
            page: state.userFilter.pagination?.page
              || INITIAL_PAGINATION.page,
            pageSize: action.payload,
          },
        },
      };
    }

    case "SET_SHOPOWNER_FILTER": {
      return {
        ...state,
        shopownerFilter: {
          ...state.shopownerFilter,
          ...action.payload,
        },
      };
    }
    case "SET_SHOPOWNER_PAGE": {
      return {
        ...state,
        shopownerFilter: {
          ...state.shopownerFilter,
          pagination: {
            pageSize: state.shopownerFilter.pagination?.pageSize
              || INITIAL_PAGINATION.pageSize,
            page: action.payload,
          },
        },
      };
    }
    case "SET_SHOPOWNER_PAGE_SIZE": {
      return {
        ...state,
        shopownerFilter: {
          ...state.shopownerFilter,
          pagination: {
            page: state.shopownerFilter.pagination?.page
              || INITIAL_PAGINATION.page,
            pageSize: action.payload,
          },
        },
      };
    }

    case "SET_PERMISSION_FILTER": {
      return {
        ...state,
        permissionFilter: {
          ...state.permissionFilter,
          ...action.payload,
        },
      };
    }
    case "SET_PERMISSION_PAGE": {
      return {
        ...state,
        permissionFilter: {
          ...state.permissionFilter,
          pagination: {
            pageSize: state.permissionFilter.pagination?.pageSize
              || INITIAL_PAGINATION.pageSize,
            page: action.payload,
          },
        },
      };
    }
    case "SET_PERMISSION_PAGE_SIZE": {
      return {
        ...state,
        permissionFilter: {
          ...state.permissionFilter,
          pagination: {
            page: state.permissionFilter.pagination?.page
              || INITIAL_PAGINATION.page,
            pageSize: action.payload,
          },
        },
      };
    }

    case "SET_ROLE_FILTER": {
      return {
        ...state,
        roleFilter: {
          ...state.roleFilter,
          ...action.payload,
        },
      };
    }
    case "SET_ROLE_PAGE": {
      return {
        ...state,
        roleFilter: {
          ...state.roleFilter,
          pagination: {
            pageSize: state.roleFilter.pagination?.pageSize
              || INITIAL_PAGINATION.pageSize,
            page: action.payload,
          },
        },
      };
    }
    case "SET_ROLE_PAGE_SIZE": {
      return {
        ...state,
        roleFilter: {
          ...state.roleFilter,
          pagination: {
            page: state.roleFilter.pagination?.page
              || INITIAL_PAGINATION.page,
            pageSize: action.payload,
          },
        },
      };
    }

    case "SET_ORDER_FILTER": {
      return {
        ...state,
        orderFilter: {
          ...state.orderFilter,
          ...action.payload,
        },
      };
    }
    case "SET_ORDER_PAGE": {
      return {
        ...state,
        orderFilter: {
          ...state.orderFilter,
          pagination: {
            pageSize: state.orderFilter.pagination?.pageSize
              || INITIAL_PAGINATION.pageSize,
            page: action.payload,
          },
        },
      };
    }
    case "SET_ORDER_PAGE_SIZE": {
      return {
        ...state,
        orderFilter: {
          ...state.orderFilter,
          pagination: {
            page: state.orderFilter.pagination?.page
              || INITIAL_PAGINATION.page,
            pageSize: action.payload,
          },
        },
      };
    }

    case "SET_POTENTIAL_ORDER_FILTER": {
      return {
        ...state,
        potentialOrderFilter: {
          ...state.potentialOrderFilter,
          ...action.payload,
        },
      };
    }
    case "SET_POTENTIAL_ORDER_PAGE": {
      return {
        ...state,
        potentialOrderFilter: {
          ...state.potentialOrderFilter,
          pagination: {
            pageSize: state.potentialOrderFilter.pagination?.pageSize
              || INITIAL_PAGINATION.pageSize,
            page: action.payload,
          },
        },
      };
    }
    case "SET_POTENTIAL_ORDER_PAGE_SIZE": {
      return {
        ...state,
        potentialOrderFilter: {
          ...state.potentialOrderFilter,
          pagination: {
            page: state.potentialOrderFilter.pagination?.page
              || INITIAL_PAGINATION.page,
            pageSize: action.payload,
          },
        },
      };
    }

    case "SET_PICKUP_ADDRESS_FILTER": {
      return {
        ...state,
        pickupAddressFilter: {
          ...state.pickupAddressFilter,
          ...action.payload,
        },
      };
    }
    case "SET_PICKUP_PAGE": {
      return {
        ...state,
        pickupAddressFilter: {
          ...state.pickupAddressFilter,
          pagination: {
            pageSize: state.pickupAddressFilter.pagination?.pageSize
              || INITIAL_PAGINATION.pageSize,
            page: action.payload,
          },
        },
      };
    }
    case "SET_PICKUP_PAGE_SIZE": {
      return {
        ...state,
        pickupAddressFilter: {
          ...state.pickupAddressFilter,
          pagination: {
            page: state.pickupAddressFilter.pagination?.page
              || INITIAL_PAGINATION.page,
            pageSize: action.payload,
          },
        },
      };
    }

    case "SET_USER_ADDRESS_FILTER": {
      return {
        ...state,
        userAddressFilter: {
          ...state.userAddressFilter,
          ...action.payload,
        },
      };
    }
    case "SET_USER_ADDRESS_PAGE": {
      return {
        ...state,
        userAddressFilter: {
          ...state.userAddressFilter,
          pagination: {
            pageSize: state.userAddressFilter.pagination?.pageSize
              || INITIAL_PAGINATION.pageSize,
            page: action.payload,
          },
        },
      };
    }
    case "SET_USER_ADDRESS_PAGE_SIZE": {
      return {
        ...state,
        userAddressFilter: {
          ...state.userAddressFilter,
          pagination: {
            page: state.userAddressFilter.pagination?.page
              || INITIAL_PAGINATION.page,
            pageSize: action.payload,
          },
        },
      };
    }

    case "SET_AUDIT_LOG_FILTER": {
      return {
        ...state,
        auditLogFilter: {
          ...state.auditLogFilter,
          ...action.payload,
        },
      };
    }
    case "SET_AUDIT_LOG_PAGE": {
      return {
        ...state,
        auditLogFilter: {
          ...state.auditLogFilter,
          pagination: {
            pageSize: state.auditLogFilter.pagination?.pageSize
              || INITIAL_PAGINATION.pageSize,
            page: action.payload,
          },
        },
      };
    }
    case "SET_AUDIT_LOG_PAGE_SIZE": {
      return {
        ...state,
        auditLogFilter: {
          ...state.auditLogFilter,
          pagination: {
            page: state.auditLogFilter.pagination?.page
              || INITIAL_PAGINATION.page,
            pageSize: action.payload,
          },
        },
      };
    }

    case "SET_ACCESS_LOG_FILTER": {
      return {
        ...state,
        accessLogFilter: {
          ...state.accessLogFilter,
          ...action.payload,
        },
      };
    }
    case "SET_ACCESS_LOG_PAGE": {
      return {
        ...state,
        accessLogFilter: {
          ...state.accessLogFilter,
          pagination: {
            pageSize: state.accessLogFilter.pagination?.pageSize
              || INITIAL_PAGINATION.pageSize,
            page: action.payload,
          },
        },
      };
    }
    case "SET_ACCESS_LOG_PAGE_SIZE": {
      return {
        ...state,
        accessLogFilter: {
          ...state.accessLogFilter,
          pagination: {
            page: state.accessLogFilter.pagination?.page
              || INITIAL_PAGINATION.page,
            pageSize: action.payload,
          },
        },
      };
    }

    case "SET_EXCHANGE_FILTER": {
      return {
        ...state,
        exchangeFilter: {
          ...state.exchangeFilter,
          ...action.payload,
        },
      };
    }
    case "SET_EXCHANGE_PAGE": {
      return {
        ...state,
        exchangeFilter: {
          ...state.exchangeFilter,
          pagination: {
            pageSize: state.exchangeFilter.pagination?.pageSize
              || INITIAL_PAGINATION.pageSize,
            page: action.payload,
          },
        },
      };
    }
    case "SET_EXCHANGE_PAGE_SIZE": {
      return {
        ...state,
        exchangeFilter: {
          ...state.exchangeFilter,
          pagination: {
            page: state.exchangeFilter.pagination?.page
              || INITIAL_PAGINATION.page,
            pageSize: action.payload,
          },
        },
      };
    }

    case "SET_COUPON_FILTER": {
      return {
        ...state,
        couponFilter: {
          ...state.couponFilter,
          ...action.payload,
        },
      };
    }
    case "SET_COUPON_PAGE": {
      return {
        ...state,
        couponFilter: {
          ...state.couponFilter,
          pagination: {
            pageSize: state.couponFilter.pagination?.pageSize
              || INITIAL_PAGINATION.pageSize,
            page: action.payload,
          },
        },
      };
    }
    case "SET_COUPON_PAGE_SIZE": {
      return {
        ...state,
        couponFilter: {
          ...state.couponFilter,
          pagination: {
            page: state.couponFilter.pagination?.page
              || INITIAL_PAGINATION.page,
            pageSize: action.payload,
          },
        },
      };
    }

    case "SET_CATEGORY_FILTER": {
      return {
        ...state,
        categoryFilter: {
          ...state.categoryFilter,
          ...action.payload,
        },
      };
    }
    case "SET_CATEGORY_PAGE": {
      return {
        ...state,
        categoryFilter: {
          ...state.categoryFilter,
          pagination: {
            pageSize: state.categoryFilter.pagination?.pageSize
              || INITIAL_PAGINATION.pageSize,
            page: action.payload,
          },
        },
      };
    }
    case "SET_CATEGORY_PAGE_SIZE": {
      return {
        ...state,
        categoryFilter: {
          ...state.categoryFilter,
          pagination: {
            page: state.categoryFilter.pagination?.page
              || INITIAL_PAGINATION.page,
            pageSize: action.payload,
          },
        },
      };
    }

    case "SET_SALES_CATEGORY_FILTER": {
      return {
        ...state,
        salesCategoryFilter: {
          ...state.salesCategoryFilter,
          ...action.payload,
        },
      };
    }
    case "SET_SALES_CATEGORY_PAGE": {
      return {
        ...state,
        salesCategoryFilter: {
          ...state.salesCategoryFilter,
          pagination: {
            pageSize: state.salesCategoryFilter.pagination?.pageSize
              || INITIAL_PAGINATION.pageSize,
            page: action.payload,
          },
        },
      };
    }
    case "SET_SALES_CATEGORY_PAGE_SIZE": {
      return {
        ...state,
        salesCategoryFilter: {
          ...state.salesCategoryFilter,
          pagination: {
            page: state.salesCategoryFilter.pagination?.page
              || INITIAL_PAGINATION.page,
            pageSize: action.payload,
          },
        },
      };
    }

    case "SET_BRAND_FILTER": {
      return {
        ...state,
        brandFilter: {
          ...state.brandFilter,
          ...action.payload,
        },
      };
    }
    case "SET_BRAND_PAGE": {
      return {
        ...state,
        brandFilter: {
          ...state.brandFilter,
          pagination: {
            pageSize: state.brandFilter.pagination?.pageSize
              || INITIAL_PAGINATION.pageSize,
            page: action.payload,
          },
        },
      };
    }
    case "SET_BRAND_PAGE_SIZE": {
      return {
        ...state,
        brandFilter: {
          ...state.brandFilter,
          pagination: {
            page: state.brandFilter.pagination?.page
              || INITIAL_PAGINATION.page,
            pageSize: action.payload,
          },
        },
      };
    }

    case "SET_TOWNSHIP_FILTER": {
      return {
        ...state,
        townshipFilter: {
          ...state.townshipFilter,
          ...action.payload,
        },
      };
    }
    case "SET_TOWNSHIP_PAGE": {
      return {
        ...state,
        townshipFilter: {
          ...state.townshipFilter,
          pagination: {
            pageSize: state.townshipFilter.pagination?.pageSize
              || INITIAL_PAGINATION.pageSize,
            page: action.payload,
          },
        },
      };
    }
    case "SET_TOWNSHIP_PAGE_SIZE": {
      return {
        ...state,
        townshipFilter: {
          ...state.townshipFilter,
          pagination: {
            page: state.townshipFilter.pagination?.page
              || INITIAL_PAGINATION.page,
            pageSize: action.payload,
          },
        },
      };
    }

    case "SET_REGION_FILTER": {
      return {
        ...state,
        regionFilter: {
          ...state.regionFilter,
          ...action.payload,
        },
      };
    }
    case "SET_REGION_PAGE": {
      return {
        ...state,
        regionFilter: {
          ...state.regionFilter,
          pagination: {
            pageSize: state.regionFilter.pagination?.pageSize
              || INITIAL_PAGINATION.pageSize,
            page: action.payload,
          },
        },
      };
    }
    case "SET_REGION_PAGE_SIZE": {
      return {
        ...state,
        regionFilter: {
          ...state.regionFilter,
          pagination: {
            page: state.regionFilter.pagination?.page
              || INITIAL_PAGINATION.page,
            pageSize: action.payload,
          },
        },
      };
    }

    case "SET_PRODUCT_FILTER": {
      return {
        ...state,
        productFilter: {
          ...state.productFilter,
          ...action.payload,
        },
      };
    }
    case "SET_PRODUCT_PAGE": {
      return {
        ...state,
        productFilter: {
          ...state.productFilter,
          pagination: {
            pageSize: state.productFilter.pagination?.pageSize
              || INITIAL_PAGINATION.pageSize,
            page: action.payload,
          },
        },
      };
    }
    case "SET_PRODUCT_PAGE_SIZE": {
      return {
        ...state,
        productFilter: {
          ...state.productFilter,
          pagination: {
            page: state.productFilter.pagination?.page
              || INITIAL_PAGINATION.page,
            pageSize: action.payload,
          },
        },
      };
    }

    case "DISABLE_CHECKOUT": {
      return {
        ...state,
        disableCheckOut: true,
      };
    }

    case "ENABLE_CHECKOUT": {
      return {
        ...state,
        disableCheckOut: false,
      };
    }

    default: {
      const _: never = action;
      console.warn({ message: "Unhandled action type", _ });
      throw AppError.new(
        AppErrorKind.InvalidInputError,
        "Unhandled action type",
      );
    }
  }
};

interface StoreProviderProps {
  children: React.ReactNode;
}

export function StoreProvider(props: StoreProviderProps) {
  const { children } = props;
  const [state, dispatch] = useReducer(stateReducer, initialState);
  const value = { state, dispatch };

  return (
    <StoreContext.Provider value={value}>
      {children}
    </StoreContext.Provider>
  );
}
