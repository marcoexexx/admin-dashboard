import { useNavigate } from "react-router-dom"
import { LinkLabel } from "@/components";
import { User } from "@/services/types";


export function RenderUsernameLabel({ user, me }: { user: User, me: User }) {
  const navigate = useNavigate()
  const to = user.id !== me.id
    ? "/profile/detail/" + user.username
    : "/me"

  const handleNavigate = () => {
    navigate(to)
  }

  return <LinkLabel onClick={handleNavigate}>
    {user.name}
  </LinkLabel>
}

