import { useNavigate } from "react-router-dom"
import { LinkLabel } from "@/components";

export function RenderUsernameLabel({user}: {user: IUser}) {
  const navigate = useNavigate()
  const to = "/profile/detail/" + user.username

  return <LinkLabel onClick={() => navigate(to)}>
    {user.name}
  </LinkLabel>
}

