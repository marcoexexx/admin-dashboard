import { colors } from "@/themes/lightSchema";
import { ComponentCustomizedStyle } from "../types";

export const MuiStepper: ComponentCustomizedStyle["MuiStepper"] = {
  styleOverrides: {
    root: {
      paddingTop: 20,
      paddingBottom: 20,
      background: colors.alpha.black[5]
    }
  }
}

