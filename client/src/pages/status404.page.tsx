import SearchTwoToneIcon from "@mui/icons-material/SearchTwoTone";
import {
  Box,
  Button,
  Card,
  Container,
  Divider,
  FormControl,
  InputAdornment,
  OutlinedInput,
  styled,
  Typography,
} from "@mui/material";

const MainContent = styled(Box)(() => ({
  height: "100%",
  display: "flex",
  overflow: "auto",
  flexDirection: "column",
  alignItems: "center",
  justifyContent: "center",
}));

const OutlinedInputWrapper = styled(OutlinedInput)(({ theme }) => ({
  backgroundColor: theme.colors.alpha.white[100],
}));

const ButtonSearch = styled(Button)(({ theme }) => ({
  marginRight: `-${theme.spacing(1)}`,
}));

export default function Status404() {
  return (
    <MainContent>
      <Container maxWidth="md">
        <Box textAlign="center">
          <img alt="404" height={180} src="/static/status/404.svg" />
          <Typography variant="h2" sx={{ my: 2 }}>
            The page you were looking for doesn't exist.
          </Typography>
          <Typography variant="h4" color="text.secondary" fontWeight="normal" sx={{ mb: 4 }}>
            It's on us, we moved the content to a different page. The search below should help!
          </Typography>
        </Box>

        <Container maxWidth="sm">
          <Card sx={{ textAlign: "center", mt: 3, p: 4 }}>
            <FormControl variant="outlined" fullWidth>
              <OutlinedInputWrapper
                type="text"
                placeholder="Search terms here..."
                endAdornment={
                  <InputAdornment position="end">
                    <ButtonSearch variant="outlined" size="small">
                      Search
                    </ButtonSearch>
                  </InputAdornment>
                }
                startAdornment={
                  <InputAdornment position="start">
                    <SearchTwoToneIcon />
                  </InputAdornment>
                }
              />
            </FormControl>

            <Divider sx={{ my: 4 }}>OR</Divider>

            <Button href="/home" variant="outlined">
              Go to homepage
            </Button>
          </Card>
        </Container>
      </Container>
    </MainContent>
  );
}
