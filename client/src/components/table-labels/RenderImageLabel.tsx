import { styled } from "@mui/material";

const Image = styled("img")(({ theme }) => ({
  height: theme.spacing(10),
  borderRadius: theme.shape.borderRadius,
}));

export function RenderImageLabel({ src, alt }: { src: string; alt: string; }) {
  return <Image src={src} alt={alt} />;
}
