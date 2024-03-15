import { CacheResource } from "@/context/cacheKey";
import { Brand } from "@/services/types";
import { useNavigate } from "react-router-dom";
import { LinkLabel } from "..";

export function RenderBrandLabel({ brand }: { brand: Brand; }) {
  const navigate = useNavigate();
  const to = `/${CacheResource.Brand}/detail/${brand.id}`;

  const handleNavigate = () => {
    navigate(to);
  };

  return (
    <LinkLabel onClick={handleNavigate}>
      {brand.name}
    </LinkLabel>
  );
}
