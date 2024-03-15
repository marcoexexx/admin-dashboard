import { colors } from "@/themes/lightSchema";
import { ComponentCustomizedStyle } from "../types";

export const MuiOutlinedInput: ComponentCustomizedStyle["MuiOutlinedInput"] = {
  styleOverrides: {
    root: {
      "& .MuiInputAdornment-positionEnd.MuiInputAdornment-outlined": {
        paddingRight: 6,
      },
      "&:hover .MuiOutlinedInput-notchedOutline": {
        borderColor: colors.alpha.black[50],
      },
      "&.Mui-focused:hover .MuiOutlinedInput-notchedOutline": {
        borderColor: colors.primary.main,
      },
    },
  },
};
