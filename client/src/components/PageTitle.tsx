import { PageBreadcrumbs } from "@/components";
import { Box, Container, styled } from "@mui/material";

const MainContent = styled(Box)(({ theme }) => ({
  padding: theme.spacing(4),
}));

interface PageTitleProps {
  children: React.ReactNode;
}

export function PageTitle(props: PageTitleProps) {
  const { children } = props;

  return (
    <MainContent className="MuiPageTitle-wrapper">
      <Container maxWidth="lg">
        <PageBreadcrumbs />

        {children}
      </Container>
    </MainContent>
  );
}
