import getConfig from "@/libs/getConfig";
import { Box, Typography, styled } from "@mui/material";
import { useNavigate } from "react-router-dom";

const MainContent = styled(Box)(({}) => ({
  display: "flex",
  flexDirection: "row",
  alignItems: "center",
  justifyContent: "left",
  gap: 23,
  width: "100%",
}))

const LogoLabel = styled(Typography)(({theme}) => ({
  fontSize: theme.typography.pxToRem(23),
  fontWeight: theme.typography.fontWeightBold
}))

const Image = styled("img")(({theme}) => ({
  height: theme.spacing(10),
  cursor: "pointer"
}))

export default function Logo() {
  const navigate = useNavigate()

  const handleOnClickLogo = () => {
    navigate("/")
  }

  return (
    <MainContent>
      <Image
        src="https://rangoondiscount.com/static/media/rangoon-discount.9e1863bad8f2d5678e8a.png"
        alt="logo"
        onClick={handleOnClickLogo}
      />

      <LogoLabel>{getConfig("appName")}</LogoLabel>
    </MainContent>
  )
}
