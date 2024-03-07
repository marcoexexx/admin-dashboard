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
  UserAddress: "addresses",
  User: "users",
  AuthUser: "authUser",
  Dashboard: "dashboard",
  Role: "roles",
  Permission: "permissions",
  Cart: "cart",
  Shopowner: "shopowners",
  OrderItem: "order-items" // api not provided yet
} as const
export type CacheResource = typeof CacheResource[keyof typeof CacheResource]


export type CacheKey<T extends CacheResource> = {
  list: [`${T}`, { filter?: object, pagination?: Pagination, include?: object }],
  detail: [`${T}`, { id?: string, include?: object }]
}
