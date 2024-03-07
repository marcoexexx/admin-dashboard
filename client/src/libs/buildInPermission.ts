import { OperationAction, Permission, Resource } from "@/services/types"

// There are access allowed, even does not have role permission
export const guestUserAccessResources: Pick<Permission, "action" | "resource">[] = [
  // Products
  {
    resource: Resource.Product,
    action: OperationAction.Read
  },

  // AccessLog

  // AuditLog

  // User

  // Brand
  {
    resource: Resource.Brand,
    action: OperationAction.Read
  },

  // Category
  {
    resource: Resource.Category,
    action: OperationAction.Read
  },

  // Coupon

  // Exchange

  // Order
  {
    resource: Resource.Order,
    action: OperationAction.Read
  },
  {
    resource: Resource.Order,
    action: OperationAction.Create
  },

  // PickupAddress
  {
    resource: Resource.PickupAddress,
    action: OperationAction.Read
  },
  {
    resource: Resource.PickupAddress,
    action: OperationAction.Create
  },
  {
    resource: Resource.PickupAddress,
    action: OperationAction.Update
  },
  {
    resource: Resource.PickupAddress,
    action: OperationAction.Delete
  },

  // PotentialOrder
  {
    resource: Resource.PotentialOrder,
    action: OperationAction.Read
  },
  {
    resource: Resource.PotentialOrder,
    action: OperationAction.Create
  },

  // Region
  {
    resource: Resource.Region,
    action: OperationAction.Read
  },

  // SalesCategory
  {
    resource: Resource.SalesCategory,
    action: OperationAction.Read
  },

  // Township
  {
    resource: Resource.Township,
    action: OperationAction.Read
  },

  // UserAddress
  {
    resource: Resource.UserAddress,
    action: OperationAction.Create
  },
  {
    resource: Resource.UserAddress,
    action: OperationAction.Read
  },
  {
    resource: Resource.UserAddress,
    action: OperationAction.Update
  },
  {
    resource: Resource.UserAddress,
    action: OperationAction.Delete
  },

  // Cart
  {
    resource: Resource.Cart,
    action: OperationAction.Read
  },
  {
    resource: Resource.Cart,
    action: OperationAction.Create
  },
  {
    resource: Resource.Cart,
    action: OperationAction.Update
  },
  {
    resource: Resource.Cart,
    action: OperationAction.Delete
  },

  // Cart
  {
    resource: Resource.OrderItem,
    action: OperationAction.Read
  },
  {
    resource: Resource.OrderItem,
    action: OperationAction.Create
  },
  {
    resource: Resource.OrderItem,
    action: OperationAction.Update
  },
  {
    resource: Resource.OrderItem,
    action: OperationAction.Delete
  },
]


// There are access allowed, even does not have role permission
export const shopownerAccessResources: Pick<Permission, "action" | "resource">[] = [
  {
    resource: Resource.Product,
    action: OperationAction.Create
  },
  {
    resource: Resource.Product,
    action: OperationAction.Update
  },

  // AccessLog
  {
    resource: Resource.AccessLog,
    action: OperationAction.Read
  },

  // AuditLog
  {
    resource: Resource.AuditLog,
    action: OperationAction.Read
  },

  // User

  // Brand
  {
    resource: Resource.Brand,
    action: OperationAction.Create
  },
  {
    resource: Resource.Brand,
    action: OperationAction.Update
  },

  // Category
  {
    resource: Resource.Category,
    action: OperationAction.Create
  },
  {
    resource: Resource.Category,
    action: OperationAction.Update
  },

  // Coupon
  {
    resource: Resource.Coupon,
    action: OperationAction.Create
  },
  {
    resource: Resource.Coupon,
    action: OperationAction.Update
  },

  // Exchange
  {
    resource: Resource.Exchange,
    action: OperationAction.Read
  },
  {
    resource: Resource.Exchange,
    action: OperationAction.Create
  },
  {
    resource: Resource.Exchange,
    action: OperationAction.Update
  },
  {
    resource: Resource.Exchange,
    action: OperationAction.Delete
  },

  // Order

  // PickupAddress

  // PotentialOrder

  // Region
  {
    resource: Resource.Region,
    action: OperationAction.Create
  },

  // SalesCategory
  {
    resource: Resource.SalesCategory,
    action: OperationAction.Create
  },
  {
    resource: Resource.SalesCategory,
    action: OperationAction.Update
  },

  // Township
  {
    resource: Resource.Township,
    action: OperationAction.Create
  },

  // UserAddress
]

