import { colors } from "@/themes/lightSchema";
import { ComponentCustomizedStyle } from "../types";
import { lighten } from "@mui/material";

export const MuiListItem: ComponentCustomizedStyle["MuiListItem"] = {
  styleOverrides: {
    root: {
      '&.MuiButtonBase-root': {
        color: colors.secondary.main,

        '&:hover, &:active, &.active, &.Mui-selected': {
          color: colors.alpha.black[100],
          background: lighten(colors.primary.lighter, 0.5)
        }
      }
    }
  }
}
