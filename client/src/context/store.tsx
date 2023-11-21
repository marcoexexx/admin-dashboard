import { createContext, useReducer } from "react"

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
  // local: i18n.local
}

interface ThemeActions {
  type: "TOGGLE_THEME",
}

interface ToastActions {
  type: "SET_TOAST",
  payload: Store["toast"]
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


type Action =
  | ThemeActions
  | ToastActions
  | ToastOpenActions
  | ToastCloseActions
  | UserActions

type Dispatch = (action: Action) => void

export const StoreContext = createContext<
  { state: Store, dispatch: Dispatch} | undefined
>(undefined)


const initialState: Store = {
  theme: localStorage.getItem("theme") as Store["theme"] || "light",
  toast: {
    status: false,
    severity: "info"
  }
}

const stateReducer = (state: Store, action: Action): Store => {
  switch (action.type) {
    case "TOGGLE_THEME": {
      const theme = state.theme === "light" ? "dark" : "light"
      localStorage.setItem("theme", theme)
      return { ...state, theme }
    }

    case "SET_TOAST": {
      return { ...state, toast: action.payload }
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
