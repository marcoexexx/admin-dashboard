import { useNavigate } from "react-router-dom"
import { LinkLabel } from ".."
import { Resource } from "@/services/types"


export function RenderResourceItemLabel({resource, id}: {resource: Resource, id: string}) {
  const navigate = useNavigate()

  const handleNavigate = () => {
    switch (resource) {

      case Resource.AccessLog: {
        navigate("/access-logs/" + id)
        return
      }

      case Resource.AuditLog: {
        navigate("/audit-logs/" + id)
        return
      }

      case Resource.User: {
        navigate("/users/detail/" + id)
        return
      }

      case Resource.Brand: {
        navigate("/brands/detail/" + id)
        return
      }

      case Resource.Category: {
        navigate("/categories/detail/" + id)
        return
      }

      case Resource.Coupon: {
        navigate("/coupons/detail/" + id)
        return
      }

      case Resource.Exchange: {
        navigate("/exchanges/detail/" + id)
        return
      }

      case Resource.Order: {
        navigate("/orders/detail/" + id)
        return
      }

      case Resource.PickupAddress: {
        navigate("/pickup-addresses/detail/" + id)
        return
      }

      case Resource.PotentialOrder: {
        navigate("/potential-orders/detail/" + id)
        return 
      }

      case Resource.Product: {
        navigate("/products/detail/" + id)
        return
      }

      case Resource.Region: {
        navigate("/regions/detail/" + id)
        return
      }

      case Resource.SalesCategory: {
        navigate("/sales-categories/detail/" + id)
        return
      }


      case Resource.Township: {
        navigate("/townships/detail/" + id)
        return
      }

      case Resource.UserAddress: {
        navigate("/addresses/detail/" + id)
        return
      }

      default: {
        const _unreachable: never = resource
        console.error(_unreachable)
      }
    }
  }

  return <LinkLabel onClick={handleNavigate}>
    {id}
  </LinkLabel>
}


