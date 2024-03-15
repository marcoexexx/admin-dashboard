import { LinkLabel } from "@/components";
import { CacheResource } from "@/context/cacheKey";
import { Category } from "@/services/types";
import { useNavigate } from "react-router-dom";

export function RenderCategoryLabel({ category }: { category: Category; }) {
  const navigate = useNavigate();
  const to = `/${CacheResource.Category}/detail/${category.id}`;

  const handleNavigate = () => {
    navigate(to);
  };

  return (
    <LinkLabel onClick={handleNavigate}>
      {category.name}
    </LinkLabel>
  );
}
