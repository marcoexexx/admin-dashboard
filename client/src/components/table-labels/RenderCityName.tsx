import { useNavigate } from "react-router-dom"
import { LinkLabel } from ".."
import { CityFees } from "@/services/types"


export function RenderCityName({city}: {city: CityFees}) {
  const navigate = useNavigate()
  const to = "/cities/detail/" + city.id

  const handleNavigate = () => {
    navigate(to)
  }

  return <LinkLabel onClick={handleNavigate}>
    {city.city}
  </LinkLabel>
}

