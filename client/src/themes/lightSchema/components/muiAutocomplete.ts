import { colors } from "@/themes/lightSchema";
import { ComponentCustomizedStyle } from "../types";

export const MuiAutocomplete: ComponentCustomizedStyle["MuiAutocomplete"] = {
  defaultProps: {
    filterSelectedOptions: true
  },

  styleOverrides: {
    tag: {
      margin: 1
    },
    root: {
      '.MuiAutocomplete-inputRoot.MuiOutlinedInput-root .MuiAutocomplete-endAdornment':
        {
          right: 14
        }
    },
    clearIndicator: {
      background: colors.error.lighter,
      color: colors.error.main,
      marginRight: 8,

      '&:hover': {
        background: colors.error.lighter,
        color: colors.error.dark
      }
    },
    popupIndicator: {
      color: colors.alpha.black[50],

      '&:hover': {
        background: colors.primary.lighter,
        color: colors.primary.main
      }
    }
  }
}

