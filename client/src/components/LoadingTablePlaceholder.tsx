import { Box, CircularProgress, styled } from "@mui/material"


const MainContent = styled(Box)(() => ({
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  marginTop: 50
}))


export interface LoadingTablePlaceholderProps {
}

export function LoadingTablePlaceholder(props: LoadingTablePlaceholderProps) {
  const {} = props
  return <MainContent>
    <CircularProgress disableShrink />
  </MainContent>
}
