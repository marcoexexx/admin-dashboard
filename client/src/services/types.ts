type Role =
  | "Admin"
  | "User"
  | "Shopowner"
  | "*"


type UserProvider =
  | "Local"
  | "Google"
  | "Facebook"


type InstockStatus =
  | "InStock"
  | "OutOfStock"
  | "AskForStock"


type PriceUnit =
  | "MMK"
  | "USD"
  | "SGD"
  | "THB"
  | "KRW"


type Coupon = {
  id: string,
  points: number,
  dolla: number
  productId?: string,
  product?: IProduct,
  expiredDate: string | Date,
  isUsed: boolean,
  image: string,
  label: string,

  createdAt: string | Date
  updatedAt: string | Date
}


type Reward = {
  id: string,
  points: number,
  coupons: Coupon[],

  createdAt: string | Date
  updatedAt: string | Date
}

interface IUser {
  // favorites        Favorites[]
  // createdProducts  Product[]    @relation("CreatedBy")
  // orders           Order[]
  // reviews          Review[]
  // accessLogs       AccessLog[]
  // addresses        Address[]

  id: string,
  name: string,
  email: string,
  password: string,
  username: string,
  role: Role,
  image: string,
  coverImage: string
  verified: boolean,
  provider: UserProvider,
  reward: Reward
  verificationCode?: string,

  createdAt: string | Date
  updatedAt: string | Date
}


// TODO: order interface

// TODO: accessLog interface

type ProductSpecification = {
  id: string,
  name: string,
  value: string,
  createdAt: string | Date
  updatedAt: string | Date
}

type ProductRecommendations = {
  id: string
  images: string[]
  totalPrice: number
  description: string
  product: IProduct
  productId: string

  createdAt: string | Date
  updatedAt: string | Date
}

interface IProduct {
  id: string,
  brandId: string,
  brand: IBrand,
  categories: {
    productId: string,
    categoryId: string,
    category: ICategory
  }[],
  salesCategory: {
    productId: string,
    salesCategoryId: string,
    salesCategory: ISalesCategory
  }[],
  title: string;
  price: number;
  _count: {
    specification: number
    categories: number
    likedUsers: number
    orders: number
    salesCategory: number
    reviews: number
  }
  images: string[]; // Assuming it's an array of image URLs
  specification: ProductSpecification[];
  overview: string;
  features: string;
  warranty: number;
  productRecommendations: ProductRecommendations;
  colors: string[];
  instockStatus: InstockStatus;
  description: string;
  dealerPrice: number;
  marketPrice: number;
  discount: number;
  status: ProductStatus;
  priceUnit: PriceUnit;
  quantity: number;
  creator?: IUser;
  itemCode?: string;
  coupons: Coupon[];
  creatorId?: string;
  createdAt: string; // Assuming it's a string representation of a date
  updatedAt: string; // Assuming it's a string representation of a date
}


interface IBrand {
  id: string,
  name: string
  _count: number
  createdAt: string | Date
  updatedAt: string | Date
}


interface IExchange {
  id: string,
  _count: number
  from: PriceUnit
  to: PriceUnit
  rate: number
  date: Date | string
  createdAt: string | Date
  updatedAt: string | Date
}


interface ISalesCategory {
  id: string,
  name: string
  createdAt: string | Date
  updatedAt: string | Date
}


interface ICategory {
  id: string,
  name: string
  createdAt: string | Date
  updatedAt: string | Date
}


interface ISalesCategory {
  id: string,
  name: string
  createdAt: string | Date
  updatedAt: string | Date
}

interface ISettings {
  theme:
  | "light"
  | "dark",
  local:
  | "my"
  | "en"
}


type ProductStatus = "Draft" | "Pending" | "Published"

type HttpResponse = {
  status: number,
  error?: string | string[],
  message: string
}

type HttpListResponse<T> = {
  status: number,
  results: Array<T>,
  count: number,
  error?: string | string[],
}

type PermissionsResponse = {
  status: number,
  permissions: {
    createAllowedRoles: Role[],
    readAllowedRoles: Role[],
    updateAllowedRoles: Role[],
    deleteAllowedRoles: Role[]
  }
  label: string
}


type QueryOptionArgs = {
  queryKey: any
  signal: AbortSignal,
  meta: Record<string, unknown> | undefined
}

type IAddress = {
  id: string,
  isDefault: boolean
  name: string
  phone: string
  state: string
  township: string
  fullAddress: string
  createdAt: string | Date
  updatedAt: string | Date
}

type OrderState =
  | "Pending"
  | "Processing"
  | "Shipped"
  | "Delivered"
  | "Cancelled"


type IOrder = {
  id: string,
  state: OrderState
  quantity: number
  createdAt: string | Date
  updatedAt: string | Date
}

type IReview = {
  id: string,
  createdAt: string | Date
  updatedAt: string | Date
  comment: string
}

type IUserProfile = IUser & {
  order: IOrder[],
  favorites: IProduct[],
  addresses: IAddress[],
  reviews: IReview[],
  _count: {
    favorites: number,
    order: number,
    createdProducts: number
    reviews: number,
    accessLogs: number,
    addresses: number
  }
}

type LoginResponse = Omit<HttpResponse, "message"> & { accessToken: string };

type UserResponse = Omit<HttpResponse, "message"> & { user: IUser, redirectUrl: string | undefined };

type UserProfileResponse = Omit<HttpResponse, "message"> & {
  user: IUserProfile
};

type CategoryResponse = Omit<HttpResponse, "message"> & { category: ICategory };

type CouponResponse = Omit<HttpResponse, "message"> & { coupon: Coupon };

type SalesCategoryResponse = Omit<HttpResponse, "message"> & { category: ISalesCategory };

type ProductResponse = Omit<HttpResponse, "message"> & { product: IProduct };

type BrandResponse = Omit<HttpResponse, "message"> & { brand: IBrand };

type ExchangeResponse = Omit<HttpResponse, "message"> & { exchange: IExchange };
