import { Theme } from "@emotion/react"
import { BreakpointsOptions, Components, PaletteOptions, alpha, createTheme } from "@mui/material"
import { TypographyOptions } from "@mui/material/styles/createTypography"

const themeColors = {
  primary: '#5569ff',
  secondary: '#6E759F',
  info: '#33C2FF',
  success: '#57CA22',
  warning: '#FFA319',
  error: '#FF1943',
  black: '#223354',
  white: '#ffffff',
  primaryAlt: '#000C57'
}

const colors = {
  gradients: {
  },
  shadows: {
    primary: "",
    secondary: "",
    info: "",
    success: "",
    warning: "",
    error: ""
  },
  alpha: {},
  primary: {
    light: alpha(themeColors.primary, 0.1),
    lighter: "",
    main: "",
    dark: ""
  },
  secondary: {},
  info: {},
  success: {},
  warning: {},
  error: {},
  layout: {
    common: {},
    sidebar: {},
    header: {}
  },
}

const breakpoints: BreakpointsOptions = {
  values: {
    xs: 0,
    sm: 600,
    md: 960,
    lg: 1280,
    xl: 1840
  }
}

const palette: PaletteOptions = {}

type ComponentCustomizedStyle = Components<Omit<Theme, "components">>
const MuiCssBaseline: ComponentCustomizedStyle["MuiCssBaseline"] = {
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
  }
}

const MuiButton: ComponentCustomizedStyle["MuiButton"] = {
  defaultProps: {
    disableRipple: true
  }
}


const components: Components<Omit<Theme, "components">> = {
  MuiCssBaseline,
  MuiButton
}

const typography: TypographyOptions = {}


export const lightTheme = createTheme({
  colors,
  palette,
  breakpoints,
  components,
  spacing: 9,
  shape: {
    borderRadius: 10
  },
  typography,
  shadows: [
    'none',
    'none',
    'none',
    'none',
    'none',
    'none',
    'none',
    'none',
    'none',
    'none',
    'none',
    'none',
    'none',
    'none',
    'none',
    'none',
    'none',
    'none',
    'none',
    'none',
    'none',
    'none',
    'none',
    'none',
    'none'
  ]
})
