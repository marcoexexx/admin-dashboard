import { BreakpointsOptions, Components, PaletteOptions, alpha, createTheme, darken, lighten, Theme } from "@mui/material"
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
    blue1: 'linear-gradient(135deg, #6B73FF 0%, #000DFF 100%)',
    blue2: 'linear-gradient(135deg, #ABDCFF 0%, #0396FF 100%)',
    blue3: 'linear-gradient(127.55deg, #141E30 3.73%, #243B55 92.26%)',
    blue4: 'linear-gradient(-20deg, #2b5876 0%, #4e4376 100%)',
    blue5: 'linear-gradient(135deg, #97ABFF 10%, #123597 100%)',
    orange1: 'linear-gradient(135deg, #FCCF31 0%, #F55555 100%)',
    orange2: 'linear-gradient(135deg, #FFD3A5 0%, #FD6585 100%)',
    orange3: 'linear-gradient(120deg, #f6d365 0%, #fda085 100%)',
    purple1: 'linear-gradient(135deg, #43CBFF 0%, #9708CC 100%)',
    purple3: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    pink1: 'linear-gradient(135deg, #F6CEEC 0%, #D939CD 100%)',
    pink2: 'linear-gradient(135deg, #F761A1 0%, #8C1BAB 100%)',
    green1: 'linear-gradient(135deg, #FFF720 0%, #3CD500 100%)',
    green2: 'linear-gradient(to bottom, #00b09b, #96c93d)',
    black1: 'linear-gradient(100.66deg, #434343 6.56%, #000000 93.57%)',
    black2: 'linear-gradient(60deg, #29323c 0%, #485563 100%)'
  },
  shadows: {
    success:
      '0px 1px 4px rgba(68, 214, 0, 0.25), 0px 3px 12px 2px rgba(68, 214, 0, 0.35)',
    error:
      '0px 1px 4px rgba(255, 25, 67, 0.25), 0px 3px 12px 2px rgba(255, 25, 67, 0.35)',
    info: '0px 1px 4px rgba(51, 194, 255, 0.25), 0px 3px 12px 2px rgba(51, 194, 255, 0.35)',
    primary:
      '0px 1px 4px rgba(85, 105, 255, 0.25), 0px 3px 12px 2px rgba(85, 105, 255, 0.35)',
    warning:
      '0px 1px 4px rgba(255, 163, 25, 0.25), 0px 3px 12px 2px rgba(255, 163, 25, 0.35)',
    card: '0px 9px 16px rgba(159, 162, 191, .18), 0px 2px 2px rgba(159, 162, 191, 0.32)',
    cardSm:
      '0px 2px 3px rgba(159, 162, 191, .18), 0px 1px 1px rgba(159, 162, 191, 0.32)',
    cardLg:
      '0 5rem 14rem 0 rgb(255 255 255 / 30%), 0 0.8rem 2.3rem rgb(0 0 0 / 60%), 0 0.2rem 0.3rem rgb(0 0 0 / 45%)'
  },
  alpha: {
    white: {
      5: alpha(themeColors.white, 0.02),
      10: alpha(themeColors.white, 0.1),
      30: alpha(themeColors.white, 0.3),
      50: alpha(themeColors.white, 0.5),
      70: alpha(themeColors.white, 0.7),
      100: themeColors.white
    },
    trueWhite: {
      5: alpha(themeColors.white, 0.02),
      10: alpha(themeColors.white, 0.1),
      30: alpha(themeColors.white, 0.3),
      50: alpha(themeColors.white, 0.5),
      70: alpha(themeColors.white, 0.7),
      100: themeColors.white
    },
    black: {
      5: alpha(themeColors.black, 0.02),
      10: alpha(themeColors.black, 0.1),
      30: alpha(themeColors.black, 0.3),
      50: alpha(themeColors.black, 0.5),
      70: alpha(themeColors.black, 0.7),
      100: themeColors.black
    }
  },
  primary: {
    lighter: lighten(themeColors.primary, 0.85),
    light: lighten(themeColors.primary, 0.3),
    main: themeColors.primary,
    dark: darken(themeColors.primary, 0.2)
  },
  secondary: {
    lighter: lighten(themeColors.secondary, 0.85),
    light: lighten(themeColors.secondary, 0.25),
    main: themeColors.secondary,
    dark: darken(themeColors.secondary, 0.2)
  },
  info: {
    lighter: lighten(themeColors.info, 0.85),
    light: lighten(themeColors.info, 0.3),
    main: themeColors.info,
    dark: darken(themeColors.info, 0.2)
  },
  success: {
    lighter: lighten(themeColors.success, 0.85),
    light: lighten(themeColors.success, 0.3),
    main: themeColors.success,
    dark: darken(themeColors.success, 0.2)
  },
  warning: {
    lighter: lighten(themeColors.warning, 0.85),
    light: lighten(themeColors.warning, 0.3),
    main: themeColors.warning,
    dark: darken(themeColors.warning, 0.2)
  },
  error: {
    lighter: lighten(themeColors.error, 0.85),
    light: lighten(themeColors.error, 0.3),
    main: themeColors.error,
    dark: darken(themeColors.error, 0.2)
  },
  layout: {
    general: {
      reactFrameworkColor: '#00D8FF',
      borderRadiusSm: '6px',
      borderRadius: '10px',
      borderRadiusLg: '12px',
      borderRadiusXl: '16px'
    },
    sidebar: {
      background: themeColors.white,
      textColor: themeColors.secondary,
      dividerBg: '#f2f5f9',
      menuItemColor: '#242E6F',
      menuItemColorActive: themeColors.primary,
      menuItemBg: themeColors.white,
      menuItemBgActive: '#f2f5f9',
      menuItemIconColor: lighten(themeColors.secondary, 0.3),
      menuItemIconColorActive: themeColors.primary,
      menuItemHeadingColor: darken(themeColors.secondary, 0.3),
      boxShadow:
        '2px 0 3px rgba(159, 162, 191, .18), 1px 0 1px rgba(159, 162, 191, 0.32)',
      width: '290px'
    },
    header: {
      height: '80px',
      background: themeColors.white,
      boxShadow: "0px 2px 3px rgba(159, 162, 191, .18), 0px 1px 1px rgba(159, 162, 191, 0.32)",
      textColor: themeColors.secondary
    }
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
    ":root": {
      '--swiper-theme-color': colors.primary.main
    }
  }
}

const MuiBackdrop: ComponentCustomizedStyle["MuiBackdrop"] = {
  styleOverrides: {
    root: {
      backgroundColor: alpha(darken(themeColors.primaryAlt, 0.4), 0.2),
      backdropFilter: 'blur(2px)',

      '&.MuiBackdrop-invisible': {
        backgroundColor: 'transparent',
        backdropFilter: 'blur(2px)'
      }
    }
  }
}

const MuiFormHelperText: ComponentCustomizedStyle["MuiFormHelperText"] = {
  styleOverrides: {
    root: {
      textTransform: 'none',
      marginLeft: 8,
      marginRight: 8,
      fontWeight: 'bold'
    }
  }
}

const MuiSelect: ComponentCustomizedStyle["MuiSelect"] = {
  styleOverrides: {
    iconOutlined: {
      color: colors.alpha.black[50]
    },
    icon: {
      top: 'calc(50% - 14px)'
    }
  }
}

const MuiOutlinedInput: ComponentCustomizedStyle["MuiOutlinedInput"] = {
  styleOverrides: {
    root: {
      '& .MuiInputAdornment-positionEnd.MuiInputAdornment-outlined': {
        paddingRight: 6
      },
      '&:hover .MuiOutlinedInput-notchedOutline': {
        borderColor: colors.alpha.black[50]
      },
      '&.Mui-focused:hover .MuiOutlinedInput-notchedOutline': {
        borderColor: colors.primary.main
      }
    }
  }
}

const MuiListSubheader: ComponentCustomizedStyle["MuiListSubheader"] = {
  styleOverrides: {
    colorPrimary: {
      fontWeight: 'bold',
      lineHeight: '40px',
      fontSize: 13,
      background: colors.alpha.black[5],
      color: colors.alpha.black[70]
    }
  }
}

const MuiCardHeader: ComponentCustomizedStyle["MuiCardHeader"] = {
  styleOverrides: {
    action: {
      marginTop: -5,
      marginBottom: -5
    },
    title: {
      fontSize: 15
    }
  }
}

const MuiRadio: ComponentCustomizedStyle["MuiRadio"] = {
  styleOverrides: {
    root: {
      borderRadius: '50px'
    }
  }
}

const MuiChip: ComponentCustomizedStyle["MuiChip"] = {
  styleOverrides: {
    colorSecondary: {
      background: colors.alpha.black[5],
      color: colors.alpha.black[100],

      '&:hover': {
        background: colors.alpha.black[10]
      }
    },
    deleteIcon: {
      color: colors.error.light,

      '&:hover': {
        color: colors.error.main
      }
    }
  }
}

const MuiAccordion: ComponentCustomizedStyle["MuiAccordion"] = {
  styleOverrides: {
    root: {
      boxShadow: 'none',

      '&.Mui-expanded': {
        margin: 0
      },
      '&::before': {
        display: 'none'
      }
    }
  }
}

const MuiAvatar: ComponentCustomizedStyle["MuiAvatar"] = {
  styleOverrides: {
    root: {
      fontSize: 14,
      fontWeight: 'bold'
    },
    colorDefault: {
      background: colors.alpha.black[30],
      color: colors.alpha.white[100]
    }
  }
}

const MuiAvatarGroup: ComponentCustomizedStyle["MuiAvatarGroup"] = {
  styleOverrides: {
    root: {
      alignItems: 'center'
    },
    avatar: {
      background: colors.alpha.black[10],
      fontSize: 13,
      color: colors.alpha.black[70],
      fontWeight: 'bold',

      '&:first-of-type': {
        border: 0,
        background: 'transparent'
      }
    }
  }
}

const MuiListItemAvatar: ComponentCustomizedStyle["MuiListItemAvatar"] = {
  styleOverrides: {
    alignItemsFlexStart: {
      marginTop: 0
    }
  }
}

const MuiPaginationItem: ComponentCustomizedStyle["MuiPaginationItem"] = {
  styleOverrides: {
    page: {
      fontSize: 13,
      fontWeight: 'bold',
      transition: 'all .2s'
    },
    textPrimary: {
      '&.Mui-selected': {
        boxShadow: colors.shadows.primary
      },
      '&.MuiButtonBase-root:hover': {
        background: colors.alpha.black[5]
      },
      '&.Mui-selected.MuiButtonBase-root:hover': {
        background: colors.primary.main
      }
    }
  }
}

const MuiButton: ComponentCustomizedStyle["MuiButton"] = {
  defaultProps: {
    disableRipple: true
  },
  styleOverrides: {
    root: {
      fontWeight: 'bold',
      textTransform: 'none',
      paddingLeft: 16,
      paddingRight: 16,

      '.MuiSvgIcon-root': {
        transition: 'all .2s'
      }
    },
    endIcon: {
      marginRight: -8
    },
    containedSecondary: {
      backgroundColor: colors.secondary.main,
      color: colors.alpha.white[100],
      border: '1px solid ' + colors.alpha.black[30]
    },
    outlinedSecondary: {
      backgroundColor: colors.alpha.white[100],

      '&:hover, &.MuiSelected': {
        backgroundColor: colors.alpha.black[5],
        color: colors.alpha.black[100]
      }
    },
    sizeSmall: {
      padding: '6px 16px',
      lineHeight: 1.5
    },
    sizeMedium: {
      padding: '8px 20px'
    },
    sizeLarge: {
      padding: '11px 24px'
    },
    textSizeSmall: {
      padding: '7px 12px'
    },
    textSizeMedium: {
      padding: '9px 16px'
    },
    textSizeLarge: {
      padding: '12px 16px'
    }
  }
}

const MuiButtonBase: ComponentCustomizedStyle["MuiButtonBase"] = {
  defaultProps: {
    disableRipple: false
  },
  styleOverrides: {
    root: {
      borderRadius: 6
    }
  }
}

const MuiToggleButton: ComponentCustomizedStyle["MuiToggleButton"] = {
  defaultProps: {
    disableRipple: true
  },
  styleOverrides: {
    root: {
      color: colors.primary.main,
      background: colors.alpha.white[100],
      transition: 'all .2s',

      '&:hover, &.Mui-selected, &.Mui-selected:hover': {
        color: colors.alpha.white[100],
        background: colors.primary.main
      }
    }
  }
}

const MuiIconButton: ComponentCustomizedStyle["MuiIconButton"] = {
  styleOverrides: {
    root: {
      borderRadius: 8,
      padding: 8,

      '& .MuiTouchRipple-root': {
        borderRadius: 8
      }
    },
    sizeSmall: {
      padding: 4
    }
  }
}

const MuiListItemText: ComponentCustomizedStyle["MuiListItemText"] = {
  styleOverrides: {
    root: {
      margin: 0
    }
  }
}

const MuiListItemButton: ComponentCustomizedStyle["MuiListItemButton"] = {
  styleOverrides: {
    root: {
      '& .MuiTouchRipple-root': {
        opacity: 0.3
      }
    }
  }
}

const MuiDivider: ComponentCustomizedStyle["MuiDivider"] = {
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

const MuiPaper: ComponentCustomizedStyle["MuiPaper"] = {
  styleOverrides: {
    root: {
      padding: 0
    },
    elevation0: {
      boxShadow: 'none'
    },
    elevation: {
      boxShadow: colors.shadows.card
    },
    elevation2: {
      boxShadow: colors.shadows.cardSm
    },
    elevation24: {
      boxShadow: colors.shadows.cardLg
    },
    outlined: {
      boxShadow: colors.shadows.card
    }
  }
}

const MuiLink: ComponentCustomizedStyle["MuiLink"] = {
  defaultProps: {
    underline: 'hover'
  }
}

const MuiLinearProgress: ComponentCustomizedStyle["MuiLinearProgress"] = {
  styleOverrides: {
    root: {
      borderRadius: 6,
      height: 6
    }
  }
}

const MuiSlider: ComponentCustomizedStyle["MuiSlider"] = {
  styleOverrides: {
    root: {
      '& .MuiSlider-valueLabelCircle, .MuiSlider-valueLabelLabel': {
        transform: 'none'
      },
      '& .MuiSlider-valueLabel': {
        borderRadius: 6,
        background: colors.alpha.black[100],
        color: colors.alpha.white[100]
      }
    }
  }
}

const MuiList: ComponentCustomizedStyle["MuiList"] = {
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

const MuiTabs: ComponentCustomizedStyle["MuiTabs"] = {
  styleOverrides: {
    root: {
      height: 38,
      minHeight: 38,
      overflow: 'visible'
    },
    indicator: {
      height: 38,
      minHeight: 38,
      borderRadius: 6,
      border: '1px solid ' + colors.primary.dark,
      boxShadow: '0px 2px 10px ' + colors.primary.light
    },
    scrollableX: {
      overflow: 'visible !important'
    }
  }
}

const MuiTab: ComponentCustomizedStyle["MuiTab"] = {
  styleOverrides: {
    root: {
      padding: 0,
      height: 38,
      minHeight: 38,
      borderRadius: 6,
      transition: 'color .2s',
      textTransform: 'capitalize',

      '&.MuiButtonBase-root': {
        minWidth: 'auto',
        paddingLeft: 20,
        paddingRight: 20,
        marginRight: 4
      },
      '&.Mui-selected, &.Mui-selected:hover': {
        color: colors.alpha.white[100],
        zIndex: 5
      },
      '&:hover': {
        color: colors.alpha.black[100]
      }
    }
  }
}

const MuiMenu: ComponentCustomizedStyle["MuiMenu"] = {
  styleOverrides: {
    paper: {
      padding: 12
    },
    list: {
      padding: 12,

      '& .MuiMenuItem-root.MuiButtonBase-root': {
        fontSize: 14,
        marginTop: 1,
        marginBottom: 1,
        transition: 'all .2s',
        color: colors.alpha.black[70],

        '& .MuiTouchRipple-root': {
          opacity: 0.2
        },

        '&:hover, &:active, &.active, &.Mui-selected': {
          color: colors.alpha.black[100],
          background: alpha(colors.primary.lighter, 0.4)
        }
      }
    }
  }
}

const MuiMenuItem: ComponentCustomizedStyle["MuiMenuItem"] = {
  styleOverrides: {
    root: {
      background: 'transparent',
      transition: 'all .2s',

      '&:hover, &:active, &.active, &.Mui-selected': {
        color: colors.alpha.black[100],
        background: alpha(colors.primary.lighter, 0.4)
      },
      '&.Mui-selected:hover': {
        background: alpha(colors.primary.lighter, 0.4)
      }
    }
  }
}

const MuiListItem: ComponentCustomizedStyle["MuiListItem"] = {
  styleOverrides: {
    root: {
      '&.MuiButtonBase-root': {
        color: colors.secondary.main,

        '&:hover, &:active, &.active, &.Mui-selected': {
          color: colors.alpha.black[100],
          background: lighten(colors.primary.lighter, 0.5)
        }
      }
    }
  }
}

const MuiAutocomplete: ComponentCustomizedStyle["MuiAutocomplete"] = {
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

const MuiTablePagination: ComponentCustomizedStyle["MuiTablePagination"] = {
  styleOverrides: {
    toolbar: {
      '& .MuiIconButton-root': {
        padding: 8
      }
    },
    select: {
      '&:focus': {
        backgroundColor: 'transparent'
      }
    }
  }
}

const MuiToolbar: ComponentCustomizedStyle["MuiToolbar"] = {
  styleOverrides: {
    root: {
      minHeight: '0 !important',
      padding: '0 !important'
    }
  }
}

const MuiTableRow: ComponentCustomizedStyle["MuiTableRow"] = {
  styleOverrides: {
    head: {
      background: colors.alpha.black[5]
    },
    root: {
      transition: 'background-color .2s',

      '&.MuiTableRow-hover:hover': {
        backgroundColor: colors.alpha.black[5]
      }
    }
  }
}

const MuiTableCell: ComponentCustomizedStyle["MuiTableCell"] = {
  styleOverrides: {
    root: {
      borderBottomColor: colors.alpha.black[10],
      fontSize: 14
    },
    head: {
      textTransform: 'uppercase',
      fontSize: 13,
      fontWeight: 'bold',
      color: colors.alpha.black[70]
    }
  }
}

const MuiAlert: ComponentCustomizedStyle["MuiAlert"] = {
  styleOverrides: {
    message: {
      lineHeight: 1.5,
      fontSize: 14
    },
    standardInfo: {
      color: colors.info.main
    },
    action: {
      color: colors.alpha.black[70]
    }
  }
}

const MuiTimelineDot = {
  styleOverrides: {
    root: {
      margin: 0,
      zIndex: 5,
      position: 'absolute',
      top: '50%',
      marginTop: -6,
      left: -6
    },
    outlined: {
      backgroundColor: colors.alpha.white[100],
      boxShadow: '0 0 0 6px ' + colors.alpha.white[100]
    },
    outlinedPrimary: {
      backgroundColor: colors.alpha.white[100],
      boxShadow: '0 0 0 6px ' + colors.alpha.white[100]
    }
  }
}

const MuiTimelineConnector = {
  styleOverrides: {
    root: {
      position: 'absolute',
      height: '100%',
      top: 0,
      borderRadius: 50,
      backgroundColor: colors.alpha.black[10]
    }
  }
}

const MuiTimelineItem = {
  styleOverrides: {
    root: {
      minHeight: 0,
      padding: '8px 0',

      '&:before': {
        display: 'none'
      }
    },
    missingOppositeContent: {
      '&:before': {
        display: 'none'
      }
    }
  }
}

const MuiTooltip: ComponentCustomizedStyle["MuiTooltip"] = {
  styleOverrides: {
    tooltip: {
      backgroundColor: alpha(colors.alpha.black['100'], 0.95),
      padding: '8px 16px',
      fontSize: 13
    },
    arrow: {
      color: alpha(colors.alpha.black['100'], 0.95)
    }
  }
}

const MuiSwitch: ComponentCustomizedStyle["MuiSwitch"] = {
  styleOverrides: {
    root: {
      height: 33,
      overflow: 'visible',

      '& .MuiButtonBase-root': {
        position: 'absolute',
        padding: 6,
        transition:
          'left 150ms cubic-bezier(0.4, 0, 0.2, 1) 0ms,transform 150ms cubic-bezier(0.4, 0, 0.2, 1) 0ms'
      },
      '& .MuiIconButton-root': {
        borderRadius: 100
      },
      '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': {
        opacity: 0.3
      }
    },
    thumb: {
      border: '1px solid ' + colors.alpha.black[30],
      boxShadow:
        '0px 9px 14px ' +
        colors.alpha.black[10] +
        ', 0px 2px 2px ' +
        colors.alpha.black[10]
    },
    track: {
      backgroundColor: colors.alpha.black[5],
      border: '1px solid ' + colors.alpha.black[10],
      boxShadow: 'inset 0px 1px 1px ' + colors.alpha.black[10],
      opacity: 1
    },
    colorPrimary: {
      '& .MuiSwitch-thumb': {
        backgroundColor: colors.alpha.white[100]
      },

      '&.Mui-checked .MuiSwitch-thumb': {
        backgroundColor: colors.primary.main
      }
    }
  }
}

const MuiStepper: ComponentCustomizedStyle["MuiStepper"] = {
  styleOverrides: {
    root: {
      paddingTop: 20,
      paddingBottom: 20,
      background: colors.alpha.black[5]
    }
  }
}

const MuiStepIcon: ComponentCustomizedStyle["MuiStepIcon"] = {
  styleOverrides: {
    root: {
      '&.MuiStepIcon-completed': {
        color: colors.success.main
      }
    }
  }
}

const MuiTypography: ComponentCustomizedStyle["MuiTypography"] = {
  defaultProps: {
    variantMapping: {
      h1: 'h1',
      h2: 'h2',
      h3: 'div',
      h4: 'div',
      h5: 'div',
      h6: 'div',
      subtitle1: 'div',
      subtitle2: 'div',
      body1: 'div',
      body2: 'div'
    }
  },
  styleOverrides: {
    gutterBottom: {
      marginBottom: 4
    },
    paragraph: {
      fontSize: 17,
      lineHeight: 1.7
    }
  }
}


const components: Components<Omit<Theme, "components">> & {
  MuiTimelineDot: any,
  MuiTimelineItem: any,
  MuiTimelineConnector: any
} = {
  MuiBackdrop,
  MuiFormHelperText,
  MuiCssBaseline,
  MuiSelect,
  MuiOutlinedInput,
  MuiListSubheader,
  MuiCardHeader,
  MuiRadio,
  MuiChip,
  MuiAccordion,
  MuiAvatar,
  MuiAvatarGroup,
  MuiListItemAvatar,
  MuiPaginationItem,
  MuiButton,
  MuiButtonBase,
  MuiToggleButton,
  MuiIconButton,
  MuiListItemText,
  MuiListItemButton,
  MuiDivider,
  MuiPaper,
  MuiLink,
  MuiLinearProgress,
  MuiSlider,
  MuiList,
  MuiTab,
  MuiTabs,
  MuiMenu,
  MuiMenuItem,
  MuiListItem,
  MuiAutocomplete,
  MuiTablePagination,
  MuiToolbar,
  MuiTableRow,
  MuiTableCell,
  MuiAlert,
  MuiTooltip,
  MuiTimelineDot,
  MuiTimelineConnector,
  MuiTimelineItem,
  MuiSwitch,
  MuiStepper,
  MuiStepIcon,
  MuiTypography,
}

const typography: TypographyOptions = {
  fontFamily:
    '"Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", Helvetica, Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji"',
  h1: {
    fontWeight: 700,
    fontSize: 35
  },
  h2: {
    fontWeight: 700,
    fontSize: 30
  },
  h3: {
    fontWeight: 700,
    fontSize: 25,
    lineHeight: 1.4,
    color: colors.alpha.black[100]
  },
  h4: {
    fontWeight: 700,
    fontSize: 16
  },
  h5: {
    fontWeight: 700,
    fontSize: 14
  },
  h6: {
    fontSize: 15
  },
  body1: {
    fontSize: 14
  },
  body2: {
    fontSize: 14
  },
  button: {
    fontWeight: 600
  },
  caption: {
    fontSize: 13,
    textTransform: 'uppercase',
    color: colors.alpha.black[50]
  },
  subtitle1: {
    fontSize: 14,
    color: colors.alpha.black[70]
  },
  subtitle2: {
    fontWeight: 400,
    fontSize: 15,
    color: colors.alpha.black[70]
  },
  overline: {
    fontSize: 13,
    fontWeight: 700,
    textTransform: 'uppercase'
  }
}


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


export type ThemeColors = typeof colors
