import { colors } from "@/themes/lightSchema";
import { ComponentCustomizedStyle } from "../types";

export const MuiAlert: ComponentCustomizedStyle["MuiAlert"] = {
  styleOverrides: {
    message: {
      lineHeight: 1.5,
      fontSize: 14
    },
    standardInfo: {
      color: colors.info.main
    },
    action: {
      color: colors.alpha.black[70]
    }
  }
}

