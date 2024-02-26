import { Local } from "@/i18n"
import { Store } from "./store"


export interface ToggleBackdropActions {
  type: "TOGGLE_BACKDROP",
}

export interface OpenBackdropActions {
  type: "OPEN_BACKDROP",
}

export interface CloseBackdropActions {
  type: "CLOSE_BACKDROP",
}

export interface EnableCheckOutActions {
  type: "DISABLE_CHECKOUT",
}

export interface DisableCheckOutActions {
  type: "ENABLE_CHECKOUT",
}

export interface ModalFormOpenActions {
  type: "OPEN_MODAL_FORM",
  payload: Store["modalForm"]["field"]
}

export interface ModalFormCloseActions {
  type: "CLOSE_MODAL_FORM",
  payload: Store["modalForm"]["field"]
}

export interface AllModalFormCloseActions {
  type: "CLOSE_ALL_MODAL_FORM",
}

export interface SlidebarToggleActions {
  type: "TOGGLE_SLIDEBAR",
}

export interface SlidebarOpenActions {
  type: "OPEN_SLIDEBAR",
}

export interface SlidebarCloseActions {
  type: "CLOSE_SLIDEBAR",
}

export interface ThemeActions {
  type: "TOGGLE_THEME",
}

export interface ToastCloseActions {
  type: "CLOSE_TOAST",
}

export interface UserActions {
  type: "SET_USER",
  payload: Store["user"]
}

export interface ToastOpenActions {
  type: "OPEN_TOAST",
  payload: Omit<Store["toast"], "status">
}

export interface LocalActions {
  type: "SET_LOCAL",
  payload: Store["local"] | Local
}

