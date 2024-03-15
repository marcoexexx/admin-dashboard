import { LinkLabel } from "@/components";
import { User } from "@/services/types";
import { useNavigate } from "react-router-dom";

export function RenderUsernameLabel({ user, me }: { user: User; me: User; }) {
  const navigate = useNavigate();
  const to = user.id !== me.id
    ? "/profile/detail/" + user.username
    : "/me";

  const handleNavigate = () => {
    navigate(to);
  };

  return (
    <LinkLabel onClick={handleNavigate}>
      {user.name}
    </LinkLabel>
  );
}
