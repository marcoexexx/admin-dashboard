import { CacheResource } from "@/context/cacheKey";
import { Region } from "@/services/types";
import { useNavigate } from "react-router-dom";
import { LinkLabel } from "..";

export function RenderRegionLabel({ region }: { region: Region; }) {
  const navigate = useNavigate();
  const to = `/${CacheResource.Region}/detail/${region.id}`;

  const handleNavigate = () => {
    navigate(to);
  };

  return (
    <LinkLabel onClick={handleNavigate}>
      {region.name}
    </LinkLabel>
  );
}
