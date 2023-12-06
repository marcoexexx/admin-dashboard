import { ComponentCustomizedStyle } from "../types";

export const MuiButtonBase: ComponentCustomizedStyle["MuiButtonBase"] = {
  defaultProps: {
    disableRipple: true
  },
  styleOverrides: {
    root: {
      borderRadius: 6
    }
  }
}

