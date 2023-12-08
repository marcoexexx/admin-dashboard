import { useNavigate } from "react-router-dom"
import { LinkLabel } from "@/components";

export function RenderCategoryLabel({category}: {category: ICategory}) {
  const navigate = useNavigate()
  const to = "/category/detail/" + category.id

  return <LinkLabel onClick={() => navigate(to)}>
    {category.name}
  </LinkLabel>
}

