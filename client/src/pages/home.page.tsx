import { queryClient } from "@/components";
import { MuiButton } from "@/components/ui";
import { useStore } from "@/hooks";
import { logoutUserFn } from "@/services/authApi";
import { Typography } from "@mui/material";
import { useMutation } from "@tanstack/react-query";

export default function Home() {
  const { state, dispatch } = useStore()

  const { mutate: logout } = useMutation({
    mutationFn: logoutUserFn,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["authUser"]
      })
    }
  })

  const onToggleThemeHandler = (_: React.MouseEvent<HTMLButtonElement>) => {
    dispatch({ type: "TOGGLE_THEME" })
  }

  const handleLogout = (_: React.MouseEvent<HTMLButtonElement>) => {
    dispatch({ type: "SET_USER", payload: undefined })
    logout()
  }

  return (
    <div>
      <Typography>{state.local}</Typography>
      <MuiButton onClick={() => {
        dispatch({ type: "SET_LOCAL", payload: "my" })
      }}>Change local</MuiButton>
      <MuiButton onClick={onToggleThemeHandler}>{state.theme}</MuiButton>
      <MuiButton onClick={handleLogout}>Logout</MuiButton>
    </div>
  )
}
