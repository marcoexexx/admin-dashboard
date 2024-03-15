import { colors } from "@/themes/lightSchema";
import { ComponentCustomizedStyle } from "../types";

export const MuiSwitch: ComponentCustomizedStyle["MuiSwitch"] = {
  styleOverrides: {
    root: {
      height: 33,
      overflow: "visible",

      "& .MuiButtonBase-root": {
        position: "absolute",
        padding: 6,
        transition: "left 150ms cubic-bezier(0.4, 0, 0.2, 1) 0ms,transform 150ms cubic-bezier(0.4, 0, 0.2, 1) 0ms",
      },
      "& .MuiIconButton-root": {
        borderRadius: 100,
      },
      "& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track": {
        opacity: 0.3,
      },
    },
    thumb: {
      border: "1px solid " + colors.alpha.black[30],
      boxShadow: "0px 9px 14px "
        + colors.alpha.black[10]
        + ", 0px 2px 2px "
        + colors.alpha.black[10],
    },
    track: {
      backgroundColor: colors.alpha.black[5],
      border: "1px solid " + colors.alpha.black[10],
      boxShadow: "inset 0px 1px 1px " + colors.alpha.black[10],
      opacity: 1,
    },
    colorPrimary: {
      "& .MuiSwitch-thumb": {
        backgroundColor: colors.alpha.white[100],
      },

      "&.Mui-checked .MuiSwitch-thumb": {
        backgroundColor: colors.primary.main,
      },
    },
  },
};
