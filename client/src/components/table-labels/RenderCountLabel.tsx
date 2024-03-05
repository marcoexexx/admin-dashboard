import { Box, Chip } from "@mui/material"

export function RenderCountLabel<T extends object>({ _count }: { _count: T }) {
  const fields = Object.keys(_count || {})

  return <Box sx={{
    display: "flex",
    alignItems: "start",
    flexDirection: "column",
    gap: 1
  }}>
    {fields.map((field, idx) => (
      <Chip key={idx} label={`${_count?.[field as keyof typeof _count]} ${field}`} />
    ))}
  </Box>
}
