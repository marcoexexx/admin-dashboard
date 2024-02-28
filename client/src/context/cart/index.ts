import { Cart, WhereInput } from "@/services/types"


export type CartWhereInput = {
  where?: WhereInput<Cart>,
  include?: {
    _count?: boolean,
    orderItems?: {
      include?: {
        product?: boolean
      }
    } | boolean
  }
}
