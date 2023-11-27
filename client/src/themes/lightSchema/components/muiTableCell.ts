import { colors } from "@/themes/lightSchema";
import { ComponentCustomizedStyle } from "../types";

export const MuiTableCell: ComponentCustomizedStyle["MuiTableCell"] = {
  styleOverrides: {
    root: {
      borderBottomColor: colors.alpha.black[10],
      fontSize: 14
    },
    head: {
      textTransform: 'uppercase',
      fontSize: 13,
      fontWeight: 'bold',
      color: colors.alpha.black[70]
    }
  }
}

