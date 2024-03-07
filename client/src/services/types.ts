export const ProductStatus = {
  Draft: "Draft",
  Pending: "Pending",
  Published: "Published"
} as const
export type ProductStatus = typeof ProductStatus[keyof typeof ProductStatus]

export const AuthProvider = {
  Local: "Local",
  Google: "Google",
  Facebook: "Facebook"
} as const
export type AuthProvider = typeof AuthProvider[keyof typeof AuthProvider]

export const Resource = {
  AccessLog: "AccessLog",
  AuditLog: "AuditLog",
  User: "User",
  Brand: "Brand",
  Category: "Category",
  Coupon: "Coupon",
  Exchange: "Exchange",
  Order: "Order",
  OrderItem: "OrderItem",
  PickupAddress: "PickupAddress",
  PotentialOrder: "PotentialOrder",
  Product: "Product",
  Region: "Region",
  SalesCategory: "SalesCategory",
  Township: "Township",
  UserAddress: "UserAddress",
  Role: "Role",
  Permission: "Permission",
  Cart: "Cart",
  Shopowner: "Shopowner"
} as const
export type Resource = typeof Resource[keyof typeof Resource]

export const ProductStockStatus = {
  Available: "Available",
  OutOfStock: "OutOfStock",
  AskForStock: "AskForStock",
  Discontinued: "Discontinued"
} as const
export type ProductStockStatus = typeof ProductStockStatus[keyof typeof ProductStockStatus]

export const PriceUnit = {
  MMK: "MMK",
  USD: "USD",
  SGD: "SGD",
  THB: "THB",
  KRW: "KRW"
} as const
export type PriceUnit = typeof PriceUnit[keyof typeof PriceUnit]

export const PaymentMethodProvider = {
  Cash: "Cash",
  AYAPay: "AYAPay",
  CBPay: "CBPay",
  KBZPay: "KBZPay",
  OnePay: "OnePay",
  UABPay: "UABPay",
  WavePay: "WavePay",
  BankTransfer: "BankTransfer"
} as const
export type PaymentMethodProvider = typeof PaymentMethodProvider[keyof typeof PaymentMethodProvider]

export const AddressType = {
  Delivery: "Delivery",
  Pickup: "Pickup"
} as const
export type AddressType = typeof AddressType[keyof typeof AddressType]

export const OrderStatus = {
  Pending: "Pending",
  Processing: "Processing",
  Shipped: "Shipped",
  Delivered: "Delivered",
  Cancelled: "Cancelled"
} as const
export type OrderStatus = typeof OrderStatus[keyof typeof OrderStatus]

export const PotentialOrderStatus = {
  Processing: "Processing",
  Confimed: "Confimed",
  Cancelled: "Cancelled"
} as const
export type PotentialOrderStatus = typeof PotentialOrderStatus[keyof typeof PotentialOrderStatus]

export const OperationAction = {
  Create: "Create",
  Read: "Read",
  Update: "Update",
  Delete: "Delete"
} as const
export type OperationAction = typeof OperationAction[keyof typeof OperationAction]


export type Cart = {
  id: string,
  label?: string,

  user?: User,
  userId?: string,
  orderItems?: OrderItem[],

  createdAt: string | Date,
  updatedAt: string | Date
}

export type Coupon = {
  id: string
  points: number
  dolla: number
  expiredDate: string | Date
  isUsed: boolean
  image: string
  label: string

  // relationship
  product?: Product
  productId?: string
  review?: Review
  reviewId?: string

  createdAt: string | Date
  updatedAt: string | Date
}


export type Reward = {
  id: string
  points: number

  // relationship
  coupons?: Coupon[]

  createdAt: string | Date
  updatedAt: string | Date
}


export type AuditLog = {
  id: string
  resource: Resource
  action: OperationAction
  resourceIds: string[]
  timestamp: Date | string

  // relationship
  user?: User
  userId?: string

  createdAt: string | Date
  updatedAt: string | Date
}


export type AccessLog = {
  id: string
  browser: string
  ip: string
  platform: string
  date: string | Date

  // relationship
  user?: User
  userId?: string

  createdAt: string | Date
  updatedAt: string | Date
}


export type OrderItem = {
  id: string
  price: number
  totalPrice: number
  originalTotalPrice: number
  saving: number
  quantity: number
  productId: string

  // relationship
  product?: Product
  order?: Order
  orderId?: string

  createdAt: string | Date
  updatedAt: string | Date
}


export type PotentialOrder = {
  id: string
  status: PotentialOrderStatus
  remark?: string
  totalPrice: number

  addressType:
  | "Delivery"
  | "Pickup"

  // relationship
  user?: User
  userId?: string
  orderItems?: OrderItem[]
  deliveryAddress?: Address
  deliveryAddressId?: string
  pickupAddress?: PickupAddress
  pickupAddressId?: string
  billingAddress?: Address
  billingAddressId?: string
  paymentMethodProvider: PaymentMethodProvider

  createdAt: string | Date
  updatedAt: string | Date
}


export type Order = {
  id: string
  status: OrderStatus
  remark?: string
  totalPrice: number

  addressType:
  | "Delivery"
  | "Pickup"

  // relationship
  user?: User
  userId?: string
  orderItems?: OrderItem[]
  deliveryAddress?: Address
  deliveryAddressId?: string
  pickupAddress?: PickupAddress
  pickupAddressId?: string
  billingAddress?: Address
  billingAddressId?: string
  paymentMethodProvider: PaymentMethodProvider

  createdAt: string | Date
  updatedAt: string | Date
}


export type Permission = {
  id: string
  action: OperationAction
  resource: Resource

  // relationship
  role?: Role
  roleId?: string

  createdAt: string | Date
  updatedAt: string | Date
}


export type Role = {
  id: string
  name: string
  remark?: string

  // relationship
  permissions?: Permission[]
  users?: User[]
  _count?: {
    users?: boolean,
    permissions?: boolean
  },

  createdAt: string | Date
  updatedAt: string | Date
}


export type ShopownerProvider = {
  id: string
  name: string
  remark?: string

  // relationship
  users?: User[]

  createdAt: string | Date
  updatedAt: string | Date
}


export type User = {
  id: string
  name: string
  email: string
  isSuperuser: boolean
  password: string
  username: string
  image: string
  coverImage: string
  verified: boolean
  provider: AuthProvider
  verificationCode?: string

  // relationship
  role?: Role
  roleId?: string
  shopownerProvider?: ShopownerProvider
  shopownerProviderId?: string

  review?: Review
  reviewId?: string
  createdProducts?: Product[]
  reviews?: Review
  accessLogs?: AccessLog[]
  addresses?: Address[]
  pickupAddresses?: PickupAddress[]
  orders?: Order[]
  cart?: Cart

  // relationship (MM)
  blockedUsers: {
    id: string,
    userId: string,
    blockedById: string,
    remark?: string
  }[],
  blockedByUsers: {
    id: string,
    userId: string,
    blockedById: string,
    remark?: string
  }[],

  _count: {
    favorites: number,
    createdProducts: number,
    reviews: number,
    accessLogs: number,
    addresses: number,
    pickupAddresses: number,
    orders: number,
    potentialOrders: number,
    eventActions: number
  }

  createdAt: string | Date
  updatedAt: string | Date
}


export type ProductSpecification = {
  id: string
  name: string
  value: string

  // relationship
  product?: Product
  productId?: string

  createdAt: string | Date
  updatedAt: string | Date
}


export type ProductRecommendations = {
  id: string
  images: string[]
  totalPrice: number
  description: string

  // relationship
  product?: Product
  productId?: string

  createdAt: string | Date
  updatedAt: string | Date
}


export type ProductSet = {
  id: string
  images: string[]
  totalPrice: number
  description: string

  // relationship (MM)
  products?: {
    productId: string
    productSetId: string
    product: Product
  }[]

  createdAt: string | Date
  updatedAt: string | Date
}


export type Product = {
  id: string
  title: string
  price: number
  images: string[]
  overview: string
  instockStatus: ProductStockStatus
  description: string
  dealerPrice: number
  marketPrice: number
  status: ProductStatus
  priceUnit: PriceUnit
  quantity: number
  itemCode?: string
  discount: number
  isDiscountItem: boolean


  // relationship
  brandId?: string
  brand?: Brand
  specification?: ProductSpecification[]
  coupons: Coupon[]
  creator?: User
  creatorId?: string

  // relationship (MM)
  categories?: {
    productId: string
    categoryId: string
    category: Category
  }[]
  salesCategory?: {
    id: string
    productId: string
    discount: number
    salesCategoryId: string
    salesCategory: SalesCategory
  }[]
  availableSets?: {
    productId: string
    productSetId: string
    productSet: ProductSet
  }[]

  _count: {
    specification: number
    categories: number
    likedUsers: number
    orders: number
    salesCategory: number
    reviews: number
  }

  createdAt: string | Date
  updatedAt: string | Date
}


export type Brand = {
  id: string,
  name: string

  // relationship
  products?: Product[]

  _count: {
    products: number
  }

  createdAt: string | Date
  updatedAt: string | Date
}


export type Exchange = {
  id: string,
  from: PriceUnit
  to: PriceUnit
  rate: number
  date: Date | string

  createdAt: string | Date
  updatedAt: string | Date
}


export type SalesCategory = {
  id: string,
  name: string
  startDate: string | Date
  endDate: string | Date
  isActive: boolean
  description?: string

  // relationship (MM)
  products?: {
    productId: string
    salesCategoryId: string
    product: Product
  }[]
  _count: {
    products: number
  }

  createdAt: string | Date
  updatedAt: string | Date
}


export type Category = {
  id: string,
  name: string

  // relationship (MM)
  products?: {
    productId: string
    categoryId: string
    product: Product
  }[]

  _count: {
    products: number
  }

  createdAt: string | Date
  updatedAt: string | Date
}


export type TownshipFees = {
  id: string,
  name: string,
  fees: number, // float

  // relationship
  region?: Region,
  regionId?: string,
  userAddresses?: Address[]
  _count?: {
    userAddresses: number
  }

  createdAt: string | Date
  updatedAt: string | Date
}


export type Region = {
  id: string,
  name: string

  // relationship
  townships?: TownshipFees[]
  userAddresses?: Address[]
  _count?: {
    townships: number,
    userAddresses: number
  }

  createdAt: string | Date
  updatedAt: string | Date
}


export type PermissionsResponse = {
  status: number,
  permissions: {
    createAllowedRoles: Role[],
    readAllowedRoles: Role[],
    updateAllowedRoles: Role[],
    deleteAllowedRoles: Role[]
  }
  label: string
}


export type PickupAddress = {
  id: string,
  username: string
  phone: string
  email?: string
  date: string | Date

  orders?: Order[]
  potentialOrders?: PotentialOrder[]
  user?: User, 

  createdAt: string | Date
  updatedAt: string | Date
}


export type Address = {
  id: string,
  isDefault: boolean
  username: string
  phone: string
  email?: string
  fullAddress: string
  remark?: string

  // relationship
  userId?: string
  user?: User
  region?: Region
  regionId?: string
  township?: TownshipFees
  townshipFeesId?: string
  deliveryOrders?: Order[],
  deveryPotentialOrders?: PotentialOrder[],
  billingOrders?: Order[],
  billingPotentialOrders?: PotentialOrder[],
  _count?: {
    deliveryOrders: number,
    billingPotentialOrders: number,
    deveryPotentialOrders: number,
    billingOrders: number,
  }

  createdAt: string | Date
  updatedAt: string | Date
}

export type Review = {
  id: string,
  comment: string

  // relationship
  userId?: string
  user?: User
  productId?: string
  product?: Product

  createdAt: string | Date
  updatedAt: string | Date
}


export type Settings = {
  theme:
  | "light"
  | "dark",
  local:
  | "my"
  | "en"
}


export type HttpResponse = {
  status: number,
  error?: string | string[],
  message: string
}

export type HttpListResponse<T> = {
  status: number,
  results: Array<T>,
  count: number,
  error?: string | string[],
}

export type Pagination = {
  page: number,
  pageSize: number
}


export type QueryOptionArgs = {
  queryKey: any
  signal: AbortSignal,
  meta: Record<string, unknown> | undefined
}


type NumberFilter = {
  equals?: number;
  not?: number;
  in?: number[];
  notIn?: number[];
  lt?: number;
  lte?: number;
  gt?: number;
  gte?: number;
} | number

type StringFilter = {
  equals?: string;
  not?: string;
  in?: string[];
  notIn?: string[];
  contains?: string;
  startsWith?: string;
  endsWith?: string;
  lt?: string;
  lte?: string;
  gt?: string;
  gte?: string;
  mode?: "insensitive" | "default",
} | string

type BooleanFilter = {
  equals?: boolean;
  not?: boolean;
} | boolean

type DateTimeFilter = {
  equals?: Date;
  not?: Date;
  in?: Date[];
  notIn?: Date[];
  lt?: Date;
  lte?: Date;
  gt?: Date;
  gte?: Date;
} | Date | string

type RelationshipFilter<T> = {
  is?: T;
  isNot?: T;
};

export type WhereInput<T> = {
  [K in keyof T]?: T[K] extends number ? NumberFilter :
                   T[K] extends string ? StringFilter :
                   T[K] extends boolean ? BooleanFilter :
                   T[K] extends Date ? DateTimeFilter :
                   T[K] extends object ? RelationshipFilter<T[K]> :
                   never
}

export type LoginResponse = Omit<HttpResponse, "message"> & { accessToken: string };
export type UserResponse = Omit<HttpResponse, "message"> & { user: User, redirectUrl: string | undefined };
export type ProductSalesCategoriesResponse = { id: string, salesCategoryId: string, productId: string, discount: number, salesCategory: SalesCategory };

export type GenericResponse<T, L extends string> = Omit<HttpResponse, "message"> & {[K in L]: T}
