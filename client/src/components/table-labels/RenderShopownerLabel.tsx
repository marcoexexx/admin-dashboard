import { CacheResource } from "@/context/cacheKey";
import { ShopownerProvider } from "@/services/types";
import { useNavigate } from "react-router-dom";
import { LinkLabel } from "..";

export function RenderShopownerLabel({ shopowner }: { shopowner: ShopownerProvider; }) {
  const navigate = useNavigate();
  const to = `/${CacheResource.Shopowner}/detail/${shopowner.id}`;

  const handleNavigate = () => {
    navigate(to);
  };

  return (
    <LinkLabel onClick={handleNavigate}>
      {shopowner.name}
    </LinkLabel>
  );
}
