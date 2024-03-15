import { colors } from "@/themes/lightSchema";
import { ComponentCustomizedStyle } from "../types";

export const MuiButton: ComponentCustomizedStyle["MuiButton"] = {
  defaultProps: {
    disableRipple: false,
  },
  styleOverrides: {
    root: {
      fontWeight: "bold",
      textTransform: "none",
      paddingLeft: 16,
      paddingRight: 16,

      ".MuiSvgIcon-root": {
        transition: "all .2s",
      },
    },
    endIcon: {
      marginRight: -8,
    },
    containedSecondary: {
      backgroundColor: colors.secondary.main,
      color: colors.alpha.white[100],
      border: "1px solid " + colors.alpha.black[30],
    },
    outlinedSecondary: {
      backgroundColor: colors.alpha.white[100],

      "&:hover, &.MuiSelected": {
        backgroundColor: colors.alpha.black[5],
        color: colors.alpha.black[100],
      },
    },
    sizeSmall: {
      padding: "6px 16px",
      lineHeight: 1.5,
    },
    sizeMedium: {
      padding: "8px 20px",
    },
    sizeLarge: {
      padding: "11px 24px",
    },
    textSizeSmall: {
      padding: "7px 12px",
    },
    textSizeMedium: {
      padding: "9px 16px",
    },
    textSizeLarge: {
      padding: "12px 16px",
    },
  },
};
