import { Pagination } from "@/services/types"

export const Resource = {
  AccessLog: "access-logs",
  AuditLog: "audit-logs",
  Brand: "brands",
  Category: "categories",
  Coupon: "coupons",
  Exchange: "exchanges",
  Order: "orders",
  PickupAddress: "pickup-addresses",
  PotentialOrder: "potential-orders",
  Product: "products",
  Region: "regions",
  SalesCategory: "sales-categories",
  Township: "townships",
  UserAddress: "user-addresses",
  User: "users",
  AuthUser: "authUser",
  Dashboard: "dashboard"
} as const
export type Resource = typeof Resource[keyof typeof Resource]


export type ResourcePermissionMap = {
  [K in keyof typeof Resource]: [`${typeof Resource[K]}-permission`]
}


export type CacheKey<T extends Resource> = {
  list: [`${T}`, { filter?: object, pagination?: Pagination, include?: object }],
  detail: [`${T}`, { id?: string, include?: object }]
}


export const PermissionKey: ResourcePermissionMap = {
  AccessLog: ["access-logs-permission"],
  AuditLog: ["audit-logs-permission"],
  Brand: ["brands-permission"],
  Category: ["categories-permission"],
  Coupon: ["coupons-permission"],
  Exchange: ["exchanges-permission"],
  Order: ["orders-permission"],
  PickupAddress: ["pickup-addresses-permission"],
  PotentialOrder: ["potential-orders-permission"],
  Product: ["products-permission"],
  Region: ["regions-permission"],
  SalesCategory: ["sales-categories-permission"],
  Township: ["townships-permission"],
  UserAddress: ["user-addresses-permission"],
  User: ["users-permission"],
  AuthUser: ["authUser-permission"],
  Dashboard: ["dashboard-permission"]
}
export type PermissionKey = typeof PermissionKey[keyof typeof PermissionKey]
// export type ExcludeResource<T extends PermissionKey> = T extends Array<`${infer U}-permission`> ? U : T
