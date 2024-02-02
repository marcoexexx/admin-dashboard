import { Role } from '@prisma/client'
import { createRoleBasedAccess } from '../rbac'

export * from './brand.permission'
export * from './category.permission'
export * from './dashboard.permission'
export * from './exchange.permission'
export * from './order.permission'
export * from './product.permission'
export * from './salesCategory.permission'
export * from './user.permission'
export * from './region.permission'
export * from './township.permission'
export * from './userAddress.permission'
export * from './potentialOrder.permission'
export * from './pickupAddress.permission'

const roleBasedAccess = createRoleBasedAccess<Role | "*">()

export default roleBasedAccess
