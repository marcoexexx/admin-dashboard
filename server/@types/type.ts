import { OperationAction, Permission, Prisma, Resource } from "@prisma/client"

export type UserWithRole = Prisma.UserGetPayload<{include: {role: {include: {permissions: true}}}}>

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
    resource: Resource.Order,
    action: OperationAction.Read
  },
  {
    resource: Resource.Order,
    action: OperationAction.Create
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
]

