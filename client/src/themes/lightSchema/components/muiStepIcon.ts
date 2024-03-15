import { colors } from "@/themes/lightSchema";
import { ComponentCustomizedStyle } from "../types";

export const MuiStepIcon: ComponentCustomizedStyle["MuiStepIcon"] = {
  styleOverrides: {
    root: {
      "&.MuiStepIcon-completed": {
        color: colors.success.main,
      },
    },
  },
};
