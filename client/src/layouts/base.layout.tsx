import { Box } from '@mui/material'
import { Outlet } from 'react-router-dom'

export function BaseLayout() {
  return (
    <Box sx={{ flex: 1, height: "100%" }}>
      <Outlet />
    </Box>
  )
}
