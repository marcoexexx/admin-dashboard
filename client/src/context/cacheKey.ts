import { Pagination } from "@/services/types"

export const CacheResource = {
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
  ProductSalesCategory: "product-sales-categories",
  Region: "regions",
  SalesCategory: "sales-categories",
  Township: "townships",
  UserAddress: "user-addresses",
  User: "users",
  AuthUser: "authUser",
  Dashboard: "dashboard"
} as const
export type CacheResource = typeof CacheResource[keyof typeof CacheResource]


export type CacheKey<T extends CacheResource> = {
  list: [`${T}`, { filter?: object, pagination?: Pagination, include?: object }],
  detail: [`${T}`, { id?: string, include?: object }]
}
