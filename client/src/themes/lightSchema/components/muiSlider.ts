import { colors } from "@/themes/lightSchema";
import { ComponentCustomizedStyle } from "../types";

export const MuiSlider: ComponentCustomizedStyle["MuiSlider"] = {
  styleOverrides: {
    root: {
      "& .MuiSlider-valueLabelCircle, .MuiSlider-valueLabelLabel": {
        transform: "none",
      },
      "& .MuiSlider-valueLabel": {
        borderRadius: 6,
        background: colors.alpha.black[100],
        color: colors.alpha.white[100],
      },
    },
  },
};
