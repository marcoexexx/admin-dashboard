import { createContext, useReducer } from "react"

type Store = {
  theme:
    | "light"
    | "dark"
  // local: i18n.local
}

interface ThemeActions {
  type: "TOGGLE_THEME",
}


type Action =
  | ThemeActions

type Dispatch = (action: Action) => void

export const StoreContext = createContext<
  { state: Store, dispatch: Dispatch} | undefined
>(undefined)


const initialState: Store = {
  theme: localStorage.getItem("theme") as Store["theme"] || "light",
}

const stateReducer = (state: Store, action: Action): Store => {
  switch (action.type) {
    case "TOGGLE_THEME": {
      const theme = state.theme === "light" ? "dark" : "light"
      localStorage.setItem("theme", theme)
      return { ...state, theme }
    }

    default: {
      const _: never = action.type
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
