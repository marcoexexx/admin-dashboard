import { ComponentCustomizedStyle } from "../types";

export const MuiIconButton: ComponentCustomizedStyle["MuiIconButton"] = {
  styleOverrides: {
    root: {
      borderRadius: 8,
      padding: 8,

      '& .MuiTouchRipple-root': {
        borderRadius: 8
      }
    },
    sizeSmall: {
      padding: 4
    }
  }
}

