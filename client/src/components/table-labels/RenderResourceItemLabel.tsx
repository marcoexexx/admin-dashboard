import { useNavigate } from "react-router-dom"
import { LinkLabel } from ".."
import { Resource } from "@/services/types"
import { CacheResource } from "@/context/cacheKey"


export function RenderResourceItemLabel({resource, id}: {resource: Resource, id: string}) {
  const navigate = useNavigate()

  const handleNavigate = () => {
    switch (resource) {

      case Resource.AccessLog: {
        navigate(`${CacheResource.AccessLog}/detail/${id}`)
        return
      }

      case Resource.AuditLog: {
        navigate(`${CacheResource.AuditLog}/detail/${id}`)
        return
      }

      case Resource.User: {
        navigate(`${CacheResource.User}/detail/${id}`)
        return
      }

      case Resource.Brand: {
        navigate(`${CacheResource.Brand}/detail/${id}`)
        return
      }

      case Resource.Category: {
        navigate(`${CacheResource.Category}/detail/${id}`)
        return
      }

      case Resource.Coupon: {
        navigate(`${CacheResource.Coupon}/detail/${id}`)
        return
      }

      case Resource.Exchange: {
        navigate(`${CacheResource.Exchange}/detail/${id}`)
        return
      }

      case Resource.Order: {
        navigate(`${CacheResource.Order}/detail/${id}`)
        return
      }

      case Resource.OrderItem: {
        // navigate(`${CacheResource.OrderItem}/detail/${id}`)  // Not reachable
        return
      }

      case Resource.PickupAddress: {
        navigate(`${CacheResource.PickupAddress}/detail/${id}`)
        return
      }

      case Resource.PotentialOrder: {
        navigate(`${CacheResource.PotentialOrder}/detail/${id}`)
        return 
      }

      case Resource.Product: {
        navigate(`${CacheResource.Product}/detail/${id}`)
        return
      }

      case Resource.Region: {
        navigate(`${CacheResource.Region}/detail/${id}`)
        return
      }

      case Resource.SalesCategory: {
        navigate(`${CacheResource.SalesCategory}/detail/${id}`)
        return
      }

      case Resource.Township: {
        navigate(`${CacheResource.Township}/detail/${id}`)
        return
      }

      case Resource.UserAddress: {
        navigate(`${CacheResource.UserAddress}/detail/${id}`)
        return
      }

      case Resource.Role: {
        navigate(`${CacheResource.Role}/detail/${id}`)
        return
      }

      case Resource.Permission: {
        navigate(`${CacheResource.Permission}/detail/${id}`)
        return
      }

      case Resource.Cart: {
        navigate(`${CacheResource.Cart}/detail/${id}`)
        return
      }

      case Resource.Shopowner: {
        navigate(`${CacheResource.Shopowner}/detail/${id}`)
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


