import { Avatar } from "@mui/material"

export function RenderProileAvatar({ src, alt }: { src: string, alt: string }) {
  return (
    <Avatar variant="rounded" alt={alt} src={src} sx={{
      height: 70,
      width: 70,
    }} />
  )
}
