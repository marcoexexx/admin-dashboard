import { Box, Typography } from "@mui/material";

// TODO: component
export function BulkActions() {
  return (
    <Box display="flex" alignItems="center" justifyContent="space-between">
      <Box display="flex" alignItems="center">
        <Typography variant="h5" color="text.secondary">
          Bulk actions:
        </Typography>
      </Box>
    </Box>
  )
}
