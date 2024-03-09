import { Box, Typography, styled } from "@mui/material";
import { useNavigate } from "react-router-dom";
import getConfig from "@/libs/getConfig";


const appName = getConfig("appName")
const appLogo = getConfig("appLogo")

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
        src={appLogo}
        alt="logo"
        onClick={handleOnClickLogo}
      />

      <LogoLabel>{appName}</LogoLabel>
    </MainContent>
  )
}
