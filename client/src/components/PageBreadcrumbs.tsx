import { Box, Breadcrumbs, Typography } from "@mui/material";
import { useLocation, useNavigate } from "react-router-dom";

export function PageBreadcrumbs() {
  const location = useLocation()
  const pathnames = location.pathname.split("/").filter(Boolean)

  const navigate = useNavigate()

  return (
    <Box py={1}>
      <Breadcrumbs
        separator="•"
      >
        {pathnames.map((name, idx) => (
          <Typography sx={{ cursor: "pointer" }} key={idx} onClick={() => navigate(`/${pathnames.slice(0, idx + 1).join("/")}`)}>
            {name}
          </Typography>
        ))}
      </Breadcrumbs>
    </Box>
  )
}
