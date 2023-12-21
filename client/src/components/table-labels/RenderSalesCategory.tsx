import { useNavigate } from "react-router-dom"
import { LinkLabel } from ".."

export function RenderSalesCategoryLabel({salesCategory}: {salesCategory: ISalesCategory}) {
  const navigate = useNavigate()
  const to = "/sales-categories/detail/" + salesCategory.id

  const handleNavigate = () => {
    navigate(to)
  }

  return <LinkLabel onClick={handleNavigate}>
    {salesCategory.name}
  </LinkLabel>
}

