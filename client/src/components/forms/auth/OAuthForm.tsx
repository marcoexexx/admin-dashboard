import { IconButton, Stack } from "@mui/material";
import { getGoogleUrl } from "@/libs/getGoogleUrl";

export function OAuthForm() {
  return <Stack flexDirection="row" alignItems="center" justifyContent="center" gap={2}>
    <IconButton href={getGoogleUrl("/home")}>
      <img alt="google icon" height={20} src="/static/google.svg" />
    </IconButton>

    <IconButton onClick={() => console.log("not avalibale right now!")}>
      <img alt="facebook icon" height={20} src="/static/facebook.svg" />
    </IconButton>
  </Stack>
}
