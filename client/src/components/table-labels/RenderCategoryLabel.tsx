import { useNavigate } from "react-router-dom"
import { LinkLabel } from "@/components";

export function RenderCategoryLabel({category}: {category: ICategory}) {
  const navigate = useNavigate()
  const to = "/category/detail/" + category.id

  const handleNavigate = () => {
    navigate(to)
  }

  return <LinkLabel onClick={handleNavigate}>
    {category.name}
  </LinkLabel>
}

