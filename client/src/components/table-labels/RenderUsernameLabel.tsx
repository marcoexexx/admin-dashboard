import { useNavigate } from "react-router-dom"
import { LinkLabel } from "@/components";

export function RenderUsernameLabel({user, me}: {user: IUser, me: IUser}) {
  const navigate = useNavigate()
  const to = user.id !== me.id 
    ? "/profile/detail/" + user.username
    : "/me"

  return <LinkLabel onClick={() => navigate(to)}>
    {user.name}
  </LinkLabel>
}

