import { useNavigate } from "react-router-dom"
import { LinkLabel } from ".."
import { SalesCategory } from "@/services/types"

export function RenderSalesCategoryLabel({salesCategory}: {salesCategory: SalesCategory}) {
  const navigate = useNavigate()
  const to = "/sales-categories/detail/" + salesCategory.id

  const handleNavigate = () => {
    navigate(to)
  }

  return <LinkLabel onClick={handleNavigate}>
    {salesCategory.name}
  </LinkLabel>
}

