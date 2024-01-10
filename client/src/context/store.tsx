import { User } from "@/services/types"
import { createContext, useReducer } from "react"
import { i18n, Local } from "@/i18n"


export type Store = {
  theme:
    | "light"
    | "dark"
  toast: {
    status: boolean,
    message?: string,
    severity: 
      | "success"
      | "error"
      | "warning"
      | "info"
  },
  modalForm: {
    // TODO: multi create exel modal
    field:
      | "*"
      | "cart"

      | "brands"
      | "products"
      | "categories"
      | "sales-categories"
      | "region"
      | "townships"

      | "update-product"  // Only for on publish product
      | "delete-product"
      | "delete-product-multi"

      | "delete-category"
      | "delete-category-multi"

      | "delete-sales-category"
      | "delete-sales-category-multi"

      | "delete-brand"
      | "delete-brand-multi"

      | "delete-exchange"
      | "delete-exchange-multi"

      | "delete-coupon"
      | "delete-coupon-multi"

      | "delete-township"
      | "delete-township-multi"

      | "delete-user-address"
      | "delete-user-address-multi"

      | "delete-region"
      | "delete-region-multi"

      | "delete-product-sale"
    state: boolean
  },
  user?: User
  slidebar: boolean
  local: Local
  accessLogFilter?: {
    fields?: any,
    page?: number,
    limit?: number,
    mode?: "insensitive" | "default",
  },
  userFilter?: {
    fields?: any,
    page?: number,
    limit?: number,
    mode?: "insensitive" | "default",
  },
  userAddressFilter?: {
    fields?: any,
    page?: number,
    limit?: number,
    mode?: "insensitive" | "default",
  },
  productFilter?: {
    fields?: any,
    page?: number,
    limit?: number,
    mode?: "insensitive" | "default",
    include?: {
      _count?: boolean
      likedUsers?: boolean,
      brand?: boolean,
      specification?: boolean,
      categories?: {
        include?: {
          category?: boolean,
          product?: boolean,
        }
      },
      salesCategory?: {
        include?: {
          salesCategory?: boolean,
          product?: boolean,
        }
      },
      reviews?: boolean
    }
  },
  salesCategoryFilter?: {
    fields?: any,
    page?: number,
    limit?: number,
    mode?: "insensitive" | "default",
    include?: {
      _count?: boolean
    }
  },
  categoryFilter?: {
    fields?: any,
    page?: number,
    limit?: number
    mode?: "insensitive" | "default"
    include?: {
      _count?: boolean
    }
  },
  brandFilter?: {
    fields?: any,
    page?: number,
    limit?: number,
    mode?: "insensitive" | "default"
    include?: {
      _count?: boolean
    }
  },
  townshipFilter?: {
    fields?: any,
    page?: number,
    limit?: number,
    mode?: "insensitive" | "default"
    include?: {
      _count?: boolean
    }
  },
  regionFilter?: {
    fields?: any,
    page?: number,
    limit?: number,
    mode?: "insensitive" | "default"
    include?: {
      _count?: boolean
    }
  },
  exchangeFilter?: {
    fields?: any,
    page?: number,
    limit?: number,
    mode?: "insensitive" | "default"
    include?: {
      _count?: boolean
    }
  },
  couponFilter?: {
    fields?: any,
    page?: number,
    limit?: number,
    mode?: "insensitive" | "default"
    include?: {
      _count?: boolean
    }
  }
}

interface UserAddressFilterActions {
  type: "SET_USER_ADDRESS_FILTER",
  payload: Store["userAddressFilter"]
}

interface AccessLogFilterActions {
  type: "SET_ACCESS_LOG_FILTER",
  payload: Store["accessLogFilter"]
}

interface TownshipFilterActions {
  type: "SET_TOWNSHIP_FILTER",
  payload: Store["townshipFilter"]
}

interface CouponFilterActions {
  type: "SET_COUPON_FILTER",
  payload: Store["couponFilter"]
}

interface UserFilterActions {
  type: "SET_USER_FILTER",
  payload: Store["userFilter"]
}

interface ProductFilterActions {
  type: "SET_PRODUCT_FILTER",
  payload: Store["productFilter"]
}

interface BrandFilterActions {
  type: "SET_BRAND_FILTER",
  payload: Store["brandFilter"]
}

interface RegionFilterActions {
  type: "SET_REGION_FILTER",
  payload: Store["regionFilter"]
}

interface ExchangeFilterActions {
  type: "SET_EXCHANGE_FILTER",
  payload: Store["exchangeFilter"]
}

interface SalesCategoryFilterActions {
  type: "SET_SALES_CATEGORY_FILTER",
  payload: Store["salesCategoryFilter"]
}

interface CategoryFilterActions {
  type: "SET_CATEGORY_FILTER",
  payload: Store["categoryFilter"]
}

interface ModalFormOpenActions {
  type: "OPEN_MODAL_FORM",
  payload: Store["modalForm"]["field"]
}

interface ModalFormCloseActions {
  type: "CLOSE_MODAL_FORM",
  payload: Store["modalForm"]["field"]
}

interface AllModalFormCloseActions {
  type: "CLOSE_ALL_MODAL_FORM",
}

interface SlidebarToggleActions {
  type: "TOGGLE_SLIDEBAR",
}

interface SlidebarOpenActions {
  type: "OPEN_SLIDEBAR",
}

interface SlidebarCloseActions {
  type: "CLOSE_SLIDEBAR",
}

interface ThemeActions {
  type: "TOGGLE_THEME",
}

interface ToastCloseActions {
  type: "CLOSE_TOAST",
}

interface UserActions {
  type: "SET_USER",
  payload: Store["user"]
}

interface ToastOpenActions {
  type: "OPEN_TOAST",
  payload: Omit<Store["toast"], "status">
}

interface LocalActions {
  type: "SET_LOCAL",
  payload: Store["local"] | Local
}


type Action =
  | ThemeActions
  | ToastOpenActions
  | ToastCloseActions
  | UserActions
  | LocalActions
  | SlidebarOpenActions
  | SlidebarToggleActions
  | SlidebarCloseActions

  | UserAddressFilterActions
  | TownshipFilterActions
  | AccessLogFilterActions
  | UserFilterActions
  | ProductFilterActions
  | BrandFilterActions
  | ExchangeFilterActions
  | CategoryFilterActions
  | SalesCategoryFilterActions
  | CouponFilterActions
  | RegionFilterActions

  | ModalFormOpenActions
  | ModalFormCloseActions
  | AllModalFormCloseActions

type Dispatch = (action: Action) => void

export const StoreContext = createContext<
  { state: Store, dispatch: Dispatch} | undefined
>(undefined)


const initialState: Store = {
  theme: localStorage.getItem("theme") as Store["theme"] || "light",
  toast: {
    status: false,
    severity: "info"
  },
  local: i18n.local,
  slidebar: false,
  modalForm: {
    field: "*",
    state: false
  },
  accessLogFilter: {
    page: 1,
    limit: 10,
    mode: "default",
  },
  userFilter: {
    page: 1,
    limit: 10,
    mode: "default",
  },
  userAddressFilter: {
    page: 1,
    limit: 10,
    mode: "default",
  },
  productFilter: {
    page: 1,
    limit: 10,
    mode: "default",
    include: {
      _count: false,
      specification: false,
      brand: true,
      categories: {
        include: {
          category: true,
        }
      },
      salesCategory: {
        include: {
          salesCategory: true
        }
      },
    },
  },
  townshipFilter: {
    page: 1,
    limit: 10,
    mode: "default",
    include: {
      _count: false,
    },
  },
  regionFilter: {
    page: 1,
    limit: 10,
    mode: "default",
    include: {
      _count: false,
    },
  },
  brandFilter: {
    page: 1,
    limit: 10,
    mode: "default",
    include: {
      _count: false,
    },
  },
  categoryFilter: {
    page: 1,
    limit: 10,
    include: {
      _count: false,
    },
    mode: "default"
  },
  salesCategoryFilter: {
    page: 1,
    limit: 10,
    include: {
      _count: false,
    },
    mode: "default"
  },
  exchangeFilter: {
    page: 1,
    limit: 10,
    include: {
      _count: false,
    },
    mode: "default"
  },
  couponFilter: {
    page: 1,
    limit: 10,
    include: {
      _count: false,
    },
    mode: "default"
  }
}

const stateReducer = (state: Store, action: Action): Store => {
  switch (action.type) {
    case "TOGGLE_THEME": {
      const theme = state.theme === "light" ? "dark" : "light"
      localStorage.setItem("theme", theme)
      return { ...state, theme }
    }

    case "OPEN_TOAST": {
      return { ...state, toast: { ...state.toast, status: true, ...action.payload } }
    }

    case "CLOSE_TOAST": {
      return { ...state, toast: { ...state.toast, status: false } }
    }

    case "SET_USER": {
      return { ...state, user: action.payload }
    }

    case "SET_LOCAL": {
      i18n.load(action.payload)
      return { ...state, local: action.payload }
    }

    case "OPEN_SLIDEBAR": {
      return { ...state, slidebar: true }
    }

    case "TOGGLE_SLIDEBAR": {
      return { ...state, slidebar: !state.slidebar }
    }

    case "CLOSE_SLIDEBAR": {
      return { ...state, slidebar: false }
    }

    case "OPEN_MODAL_FORM": {
      return { ...state, modalForm: { state: true, field: action.payload } }
    }

    case "CLOSE_MODAL_FORM": {
      return { ...state, modalForm: { state: false, field: action.payload } }
    }

    case "CLOSE_ALL_MODAL_FORM": {
      return { ...state, modalForm: { state: false, field: "*" } }
    }

    case "SET_USER_FILTER": {
      return { ...state, userFilter: {
        ...state.userFilter,
        ...action.payload
      } }
    }

    case "SET_USER_ADDRESS_FILTER": {
      return { ...state, userAddressFilter: {
        ...state.userAddressFilter,
        ...action.payload
      } }
    }

    case "SET_ACCESS_LOG_FILTER": {
      return { ...state, accessLogFilter: {
        ...state.accessLogFilter,
        ...action.payload
      } }
    }

    case "SET_EXCHANGE_FILTER": {
      return { ...state, exchangeFilter: {
        ...state.exchangeFilter,
        ...action.payload
      } }
    }

    case "SET_COUPON_FILTER": {
      return { ...state, couponFilter: {
        ...state.couponFilter,
        ...action.payload
      } }
    }

    case "SET_CATEGORY_FILTER": {
      return { ...state, categoryFilter: {
        ...state.categoryFilter,
        ...action.payload
      } }
    }

    case "SET_SALES_CATEGORY_FILTER": {
      return { ...state, salesCategoryFilter: {
        ...state.salesCategoryFilter,
        ...action.payload
      } }
    }

    case "SET_BRAND_FILTER": {
      return { ...state, brandFilter: {
        ...state.brandFilter,
        ...action.payload
      } }
    }

    case "SET_TOWNSHIP_FILTER": {
      return { ...state, townshipFilter: {
        ...state.townshipFilter,
        ...action.payload
      } }
    }

    case "SET_REGION_FILTER": {
      return { ...state, regionFilter: {
        ...state.regionFilter,
        ...action.payload
      } }
    }

    case "SET_PRODUCT_FILTER": {
      return { 
        ...state,
        productFilter: {
          ...state.productFilter,
          ...action.payload
        }
      }
    }

    default: {
      const _: never = action
      console.warn({ message: "Unhandled action type", _ })
      throw new Error("Unhandled action type")
    }
  }
}


interface StoreProviderProps {
  children: React.ReactNode
}

export function StoreProvider(props: StoreProviderProps) {
  const { children } = props
  const [state, dispatch] = useReducer(stateReducer, initialState)
  const value = { state, dispatch }

  return <StoreContext.Provider value={value}>
    {children}
  </StoreContext.Provider>
}
