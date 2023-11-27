import { colors } from "@/themes/lightSchema";
import { ComponentCustomizedStyle } from "../types";

export const MuiTableRow: ComponentCustomizedStyle["MuiTableRow"] = {
  styleOverrides: {
    head: {
      background: colors.alpha.black[5]
    },
    root: {
      transition: 'background-color .2s',

      '&.MuiTableRow-hover:hover': {
        backgroundColor: colors.alpha.black[5]
      }
    }
  }
}

