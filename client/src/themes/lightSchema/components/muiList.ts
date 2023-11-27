import { colors } from "@/themes/lightSchema";
import { ComponentCustomizedStyle } from "../types";
import { alpha } from "@mui/material";

export const MuiList: ComponentCustomizedStyle["MuiList"] = {
  styleOverrides: {
    root: {
      padding: 0,

      '& .MuiListItem-button': {
        transition: 'all .2s',

        '& > .MuiSvgIcon-root': {
          minWidth: 34
        },

        '& .MuiTouchRipple-root': {
          opacity: 0.2
        }
      },
      '& .MuiListItem-root.MuiButtonBase-root.Mui-selected': {
        backgroundColor: alpha(colors.primary.lighter, 0.4)
      },
      '& .MuiMenuItem-root.MuiButtonBase-root:active': {
        backgroundColor: alpha(colors.primary.lighter, 0.4)
      },
      '& .MuiMenuItem-root.MuiButtonBase-root .MuiTouchRipple-root': {
        opacity: 0.2
      }
    },
    padding: {
      padding: '12px',

      '& .MuiListItem-button': {
        borderRadius: 6,
        margin: '1px 0'
      }
    }
  }
}

