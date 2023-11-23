import { createContext, useReducer } from "react"
import { i18n, Local } from "@/i18n"

type Store = {
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
  user?: IUser
  slidebar: boolean
  local: Local
  productFilter?: Partial<IProduct>
}

interface ProductActions {
  type: "SET_PRODUCT_FILTER",
  payload: Partial<Record<keyof IProduct, any>>
}

interface SlidebarActions {
  type: "TOGGLE_SLIDEBAR",
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
  | SlidebarActions
  | ProductActions

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
  slidebar: false
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

    case "TOGGLE_SLIDEBAR": {
      return { ...state, slidebar: !state.slidebar }
    }

    case "SET_PRODUCT_FILTER": {
      return { 
        ...state,
        productFilter: action.payload
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
