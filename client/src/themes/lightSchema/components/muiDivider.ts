import { colors } from "@/themes/lightSchema";
import { ComponentCustomizedStyle } from "../types";

export const MuiDivider: ComponentCustomizedStyle["MuiDivider"] = {
  styleOverrides: {
    root: {
      background: colors.alpha.black[10],
      border: 0,
      height: 1
    },
    vertical: {
      height: 'auto',
      width: 1,

      '&.MuiDivider-flexItem.MuiDivider-fullWidth': {
        height: 'auto'
      },
      '&.MuiDivider-absolute.MuiDivider-fullWidth': {
        height: '100%'
      }
    },
    withChildren: {
      '&:before, &:after': {
        border: 0
      }
    },
    wrapper: {
      background: colors.alpha.white[100],
      fontWeight: 'bold',
      height: 24,
      lineHeight: '24px',
      marginTop: -12,
      color: 'inherit',
      textTransform: 'uppercase'
    }
  }
}

