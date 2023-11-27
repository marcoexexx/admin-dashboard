import { colors } from "@/themes/lightSchema";
import { ComponentCustomizedStyle } from "../types";

export const MuiAvatar: ComponentCustomizedStyle["MuiAvatar"] = {
  styleOverrides: {
    root: {
      fontSize: 14,
      fontWeight: 'bold'
    },
    colorDefault: {
      background: colors.alpha.black[30],
      color: colors.alpha.white[100]
    }
  }
}

