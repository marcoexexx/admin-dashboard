import { useNavigate } from "react-router-dom"
import { LinkLabel } from ".."
import { AuditLogResource } from "@/services/types"


export function RenderResourceItemLabel({resource, id}: {resource: AuditLogResource, id: string}) {
  const navigate = useNavigate()

  const handleNavigate = () => {
    switch (resource) {
      case AuditLogResource.User: {
        navigate("/users/detail/" + id)
        return
      }

      case AuditLogResource.Brand: {
        navigate("/brands/detail/" + id)
        return
      }

      case AuditLogResource.Order: {
        navigate("/orders/detail/" + id)
        return
      }

      case AuditLogResource.Coupon: {
        navigate("/coupons/detail/" + id)
        return
      }

      case AuditLogResource.Region: {
        navigate("/regions/detail/" + id)
        return
      }

      case AuditLogResource.Product: {
        navigate("/products/detail/" + id)
        return
      }

      case AuditLogResource.Category: {
        navigate("/categories/detail/" + id)
        return
      }

      case AuditLogResource.Exchange: {
        navigate("/exchanges/detail/" + id)
        return
      }

      case AuditLogResource.Township: {
        navigate("/townships/detail/" + id)
        return
      }

      case AuditLogResource.UserAddress: {
        navigate("/addresses/detail/" + id)
        return
      }

      case AuditLogResource.PickupAddress: {
        navigate("/pickup-addresses/detail/" + id)
        return
      }

      case AuditLogResource.SalesCategory: {
        navigate("/sales-categories/detail/" + id)
        return
      }

      case AuditLogResource.PotentialOrder: {
        navigate("/potential-orders/detail/" + id)
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


