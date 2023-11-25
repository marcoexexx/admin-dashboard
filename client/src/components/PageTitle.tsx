import { Box, Container, styled } from "@mui/material"
import { PageBreadcrumbs } from "@/components"

const MainContent = styled(Box)(({theme}) => ({
  padding: theme.spacing(4)
}))


interface PageTitleProps {
  children: React.ReactNode
}

export function PageTitle(props: PageTitleProps) {
  const { children } = props

  return (
    <MainContent className="MuiPageTitle-wrapper">
      <Container maxWidth="lg">
        <PageBreadcrumbs />

        {children}
      </Container>
    </MainContent>
  )
}
