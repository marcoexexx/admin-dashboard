import { colors } from "@/themes/lightSchema";
import { ComponentCustomizedStyle } from "../types";

export const MuiCssBaseline: ComponentCustomizedStyle["MuiCssBaseline"] = {
  styleOverrides: {
    "html, body": {
      width: "100%",
      height: "100%"
    },
    body: {
      display: "flex",
      flexDirection: "column",
      width: "100%",
      flex: 1
    },
    "#root": {
      width: "100%",
      height: "100%",
      display: "flex",
      flex: 1,
      flexDirection: "column",
    },
    html: {
      display: "flex",
      flexDirection: "column",
      minHeight: "100%",
      width: "100%",
      MozOsxFontSmoothing: 'grayscale',
      WebkitFontSmoothing: 'antialiased'
    },
    '.child-popover .MuiPaper-root .MuiList-root': {
      flexDirection: 'column'
    },
    "#nprogress": {
      pointerEvents: "none"
    },
    "#nprogress .bar": {
      background: colors.primary.lighter
    },
    '#nprogress .spinner-icon': {
      borderTopColor: colors.primary.lighter,
      borderLeftColor: colors.primary.lighter
    },
    '#nprogress .peg': {
      boxShadow:
        '0 0 15px ' +
        colors.primary.lighter +
        ', 0 0 8px' +
        colors.primary.light
    },
    ":root": {
      '--swiper-theme-color': colors.primary.main
    },
    code: {
      background: colors.info.lighter,
      color: colors.info.dark,
      borderRadius: 4,
      padding: 4
    },
    '@keyframes ripple': {
      '0%': {
        transform: 'scale(.8)',
        opacity: 1
      },
      '100%': {
        transform: 'scale(2.8)',
        opacity: 0
      }
    },
    '@keyframes float': {
      '0%': {
        transform: 'translate(0%, 0%)'
      },
      '100%': {
        transform: 'translate(3%, 3%)'
      }
    }
  }
}

