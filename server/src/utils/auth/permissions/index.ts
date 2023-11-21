import { Role } from '../../../schemas/user.schema'
import { createRoleBasedAccess } from '../rbac'

export * from './dashboard.permission'
export * from './product.permission'
export * from './user.permission'

const roleBasedAccess = createRoleBasedAccess<Role>()

export default roleBasedAccess
