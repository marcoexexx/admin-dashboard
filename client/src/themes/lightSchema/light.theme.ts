import { Components, Theme, createTheme } from '@mui/material'
import { MuiTextField, MuiAccordion, MuiButton, MuiAvatar, MuiAvatarGroup, MuiBackdrop, MuiButtonBase, MuiCardHeader, MuiChip, MuiCssBaseline, MuiDivider, MuiFormHelperText, MuiIconButton, MuiListItem, MuiListItemAvatar, MuiListItemButton, MuiListItemText, MuiListSubheader, MuiOutlinedInput, MuiPaginationItem, MuiRadio, MuiSelect, MuiStepIcon, MuiStepper, MuiToggleButton, MuiPaper, MuiLink, MuiLinearProgress, MuiSlider, MuiTabs, MuiTableRow, MuiList, MuiTab, MuiMenu, MuiMenuItem, MuiAutocomplete, MuiTablePagination, MuiToolbar, MuiTimelineDot, MuiTimelineConnector, MuiTableCell, MuiAlert, MuiTooltip, MuiTimelineItem, MuiTypography, MuiSwitch } from '@/themes/lightSchema/components'

import { colors, palette, breakpoints, typography } from '@/themes/lightSchema'


export const components: Components<Omit<Theme, "components">> & {
  MuiTimelineDot: any,
  MuiTimelineItem: any,
  MuiTimelineConnector: any
} = {
  MuiTextField,
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


const lightTheme = createTheme({
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

export default lightTheme
