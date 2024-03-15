import { CacheResource } from "@/context/cacheKey";
import { SalesCategory } from "@/services/types";
import { useNavigate } from "react-router-dom";
import { LinkLabel } from "..";

export function RenderSalesCategoryLabel({ salesCategory }: { salesCategory: SalesCategory; }) {
  const navigate = useNavigate();
  const to = `/${CacheResource.SalesCategory}/detail/${salesCategory.id}`;

  const handleNavigate = () => {
    navigate(to);
  };

  return (
    <LinkLabel onClick={handleNavigate}>
      {salesCategory.name}
    </LinkLabel>
  );
}
