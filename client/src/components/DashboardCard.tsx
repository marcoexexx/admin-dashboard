import { Avatar, Box, Typography, styled, useTheme } from "@mui/material"

import LoyaltyIcon from '@mui/icons-material/Loyalty'
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward'
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward'


const AvatarWrapper = styled(Avatar)(({theme}) => ({
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  padding: theme.spacing(0.5),
  borderRadius: "60px",
  height: theme.spacing(5.5),
  width: theme.spacing(5.5),
  // background: theme.palette.mode === "dark"
  //   ? theme.colors.alpha.trueWhite[30]
  //   : alpha(theme.colors.alpha.black[100], 0.07),
  background: theme.palette.primary.light
}))

const CardWrapper = styled(Box)(() => ({
  display: "flex",
  flexDirection: "row",
  alignItems: "start",
  justifyContent: "space-between",
}))

const HelperContentWrapper = styled(Box)(() => ({
  display: "flex",
  flexDirection: "row",
  alignItems: "center",
  justifyContent: "start",
  gap: 10,
}))


interface DashboardCardProps {
  subtitle: string
  value: string
  helperText: string
  isDown: boolean
  percent: string
}

export function DashboardCard(props: DashboardCardProps) {
  const theme = useTheme()

  const { subtitle, value, helperText, isDown, percent } = props

  return (
    <Box
      display="flex"
      flexDirection="column"
      gap={2}
    >
      <CardWrapper>
        <Box
          display="flex"
          flexDirection="column"
          gap={2}
        >
          <Typography variant="subtitle2">{subtitle}</Typography>
          <Typography variant="h3">{value}</Typography>
        </Box>
        <AvatarWrapper>
          <LoyaltyIcon />
        </AvatarWrapper>
      </CardWrapper>

      <HelperContentWrapper>
        <Box display="flex" flexDirection="row" color={isDown ? theme.colors.error.light : theme.colors.primary.light}>
          {isDown
          ? <ArrowDownwardIcon fontSize="small" />
          : <ArrowUpwardIcon fontSize="small" />}
          
          <Typography>{percent}</Typography>
        </Box>
        <Typography color={theme.colors.alpha.black[70]}>{helperText}</Typography>
      </HelperContentWrapper>
    </Box>
  )
}
