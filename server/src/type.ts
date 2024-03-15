import { OperationAction, Permission, Prisma, Resource } from "@prisma/client";
import _ from "lodash";

export type UserWithRole = Prisma.UserGetPayload<{
  include: {
    shopownerProvider: true;
    role: {
      include: {
        permissions: true;
      };
    };
    cart: true;
  };
}>;

function createResourcesPermission(accessResource: Record<Resource, OperationAction[] | "*" | "!">) {
  const perms: Pick<Permission, "action" | "resource">[] = [];

  _.forEach(accessResource, (value, key) => {
    if (value !== "!" && value !== "*") {
      for (const action of value) {
        perms.push({ action, resource: key as Resource });
      }
    } else if (value === "*") {
      perms.push({ action: OperationAction.Create, resource: key as Resource });
      perms.push({ action: OperationAction.Read, resource: key as Resource });
      perms.push({ action: OperationAction.Update, resource: key as Resource });
      perms.push({ action: OperationAction.Delete, resource: key as Resource });
    }
  });

  return perms;
}

// There are access allowed, even does not have role permission
export const guestUserAccessResources = createResourcesPermission({
  [Resource.Product]: [OperationAction.Read],
  [Resource.Role]: [OperationAction.Read],
  [Resource.Brand]: [OperationAction.Read],
  [Resource.Order]: [OperationAction.Create, OperationAction.Read],
  [Resource.Coupon]: [OperationAction.Read],
  [Resource.Region]: [OperationAction.Read],
  [Resource.AuditLog]: [OperationAction.Read],
  [Resource.Category]: [OperationAction.Read],
  [Resource.Exchange]: [OperationAction.Read],
  [Resource.Township]: [OperationAction.Read],
  [Resource.OrderItem]: [OperationAction.Create, OperationAction.Read],
  [Resource.UserAddress]: [OperationAction.Create, OperationAction.Read],
  [Resource.PickupAddress]: [OperationAction.Create, OperationAction.Read],
  [Resource.SalesCategory]: [OperationAction.Read],
  [Resource.PotentialOrder]: [OperationAction.Create, OperationAction.Read],
  [Resource.Permission]: "!",
  [Resource.Shopowner]: "!",
  [Resource.AccessLog]: "!",
  [Resource.User]: "!",
  [Resource.Cart]: "*",
});

export const customerUserAccessResources = createResourcesPermission({
  [Resource.Product]: [OperationAction.Read],
  [Resource.Role]: [OperationAction.Read],
  [Resource.Brand]: [OperationAction.Read],
  [Resource.Order]: [OperationAction.Create, OperationAction.Read],
  [Resource.Coupon]: [OperationAction.Read],
  [Resource.Region]: [OperationAction.Read],
  [Resource.AuditLog]: [OperationAction.Read],
  [Resource.Category]: [OperationAction.Read],
  [Resource.Exchange]: [OperationAction.Read],
  [Resource.Township]: [OperationAction.Read],
  [Resource.OrderItem]: [OperationAction.Create, OperationAction.Read],
  [Resource.UserAddress]: [OperationAction.Create, OperationAction.Read],
  [Resource.PickupAddress]: [OperationAction.Create, OperationAction.Read],
  [Resource.SalesCategory]: [OperationAction.Read],
  [Resource.PotentialOrder]: [OperationAction.Create, OperationAction.Read],
  [Resource.Permission]: "!",
  [Resource.Shopowner]: "!",
  [Resource.AccessLog]: [OperationAction.Create, OperationAction.Read],
  [Resource.User]: [OperationAction.Read],
  [Resource.Cart]: [OperationAction.Create, OperationAction.Read],
});

export const shopownerAccessResources = createResourcesPermission({
  [Resource.Product]: [OperationAction.Create, OperationAction.Read],
  [Resource.Role]: [OperationAction.Read],
  [Resource.Brand]: [OperationAction.Read],
  [Resource.Order]: [OperationAction.Create, OperationAction.Read],
  [Resource.Coupon]: [OperationAction.Read],
  [Resource.Region]: [OperationAction.Read],
  [Resource.AuditLog]: [OperationAction.Read],
  [Resource.Category]: [OperationAction.Read],
  [Resource.Exchange]: [OperationAction.Create, OperationAction.Read],
  [Resource.Township]: [OperationAction.Read],
  [Resource.OrderItem]: [OperationAction.Create, OperationAction.Read],
  [Resource.UserAddress]: [OperationAction.Create, OperationAction.Read],
  [Resource.PickupAddress]: [OperationAction.Create, OperationAction.Read],
  [Resource.SalesCategory]: [OperationAction.Read],
  [Resource.PotentialOrder]: [OperationAction.Create, OperationAction.Read],
  [Resource.Permission]: [OperationAction.Create, OperationAction.Read],
  [Resource.Shopowner]: [OperationAction.Read],
  [Resource.AccessLog]: [OperationAction.Create, OperationAction.Read],
  [Resource.User]: [OperationAction.Read, OperationAction.Update],
  [Resource.Cart]: [OperationAction.Create, OperationAction.Read],
});
