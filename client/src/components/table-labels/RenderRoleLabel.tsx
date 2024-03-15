import { CacheResource } from "@/context/cacheKey";
import { Role } from "@/services/types";
import { useNavigate } from "react-router-dom";
import { LinkLabel } from "..";

export function RenderRoleLabel({ role }: { role: Role; }) {
  const navigate = useNavigate();
  const to = `/${CacheResource.Role}/detail/${role.id}`;

  const handleNavigate = () => {
    navigate(to);
  };

  return (
    <LinkLabel onClick={handleNavigate}>
      {role.name}
    </LinkLabel>
  );
}
