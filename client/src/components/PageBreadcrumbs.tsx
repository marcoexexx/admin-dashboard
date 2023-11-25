import { Box, Breadcrumbs } from "@mui/material";
import { Link, useLocation } from "react-router-dom";

export function PageBreadcrumbs() {
  const location = useLocation()
  const pathnames = location.pathname.split("/").filter(Boolean)

  return (
    <Box py={1}>
      <Breadcrumbs>
        {pathnames.map((name, idx) => (
          <Link key={idx} to={`/${pathnames.slice(0, idx + 1).join("/")}`}>
            {name}
          </Link>
        ))}
      </Breadcrumbs>
    </Box>
  )
}
