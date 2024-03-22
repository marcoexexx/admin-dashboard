import { colors } from "@/themes/lightSchema";
import { ComponentCustomizedStyle } from "../types";

export const MuiTab: ComponentCustomizedStyle["MuiTab"] = {
  styleOverrides: {
    root: {
      padding: 0,
      height: 38,
      minHeight: 38,
      borderRadius: 6,
      transition: "color .2s",
      textTransform: "capitalize",

      "&.MuiButtonBase-root": {
        minWidth: "auto",
        paddingLeft: 20,
        paddingRight: 20,
        marginRight: 4,
      },
      "&.Mui-selected, &.Mui-selected:hover": {
        color: colors.alpha.white[100],
        zIndex: 5,
      },
      "&:hover": {
        color: colors.alpha.black[100],
      },
    },
  },
};
