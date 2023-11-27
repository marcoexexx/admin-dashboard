import { PaletteOptions } from "@mui/material";
import { colors } from '@/themes/lightSchema'

export const palette: PaletteOptions = {
  common: {
    black: colors.alpha.black[100],
    white: colors.alpha.white[100]
  },
  mode: 'light',
  primary: {
    light: colors.primary.light,
    main: colors.primary.main,
    dark: colors.primary.dark
  },
  secondary: {
    light: colors.secondary.light,
    main: colors.secondary.main,
    dark: colors.secondary.dark
  },
  error: {
    light: colors.error.light,
    main: colors.error.main,
    dark: colors.error.dark,
    contrastText: colors.alpha.white[100]
  },
  success: {
    light: colors.success.light,
    main: colors.success.main,
    dark: colors.success.dark,
    contrastText: colors.alpha.white[100]
  },
  info: {
    light: colors.info.light,
    main: colors.info.main,
    dark: colors.info.dark,
    contrastText: colors.alpha.white[100]
  },
  warning: {
    light: colors.warning.light,
    main: colors.warning.main,
    dark: colors.warning.dark,
    contrastText: colors.alpha.white[100]
  },
  text: {
    primary: colors.alpha.black[100],
    secondary: colors.alpha.black[70],
    disabled: colors.alpha.black[50]
  },
  background: {
    paper: colors.alpha.white[100],
    default: colors.layout.general.bodyBg
  },
  action: {
    active: colors.alpha.black[100],
    hover: colors.primary.lighter,
    hoverOpacity: 0.1,
    selected: colors.alpha.black[10],
    selectedOpacity: 0.1,
    disabled: colors.alpha.black[50],
    disabledBackground: colors.alpha.black[5],
    disabledOpacity: 0.38,
    focus: colors.alpha.black[10],
    focusOpacity: 0.05,
    activatedOpacity: 0.12
  },
  tonalOffset: 0.5
}

