type Role =
  | "Admin"
  | "User"
  | "Employee"
  | "*"


type UserProvider =
  | "Local"
  | "Google"
  | "Facebook"


type ProductType = 
  | "Switch"
  | "Router"
  | "Wifi"
  | "Accessory"


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

interface IUser {
  id: string,
  name: string,
  email: string,
  password: string,
  role: Role,
  image?: string,
  verified: boolean,
  provider: UserProvider,
  createdAt: string | Date
  updatedAt: string | Date
}


interface IProduct {
  id: string;
  brandId: string;
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
  _count: number
  images: string[]; // Assuming it's an array of image URLs
  specification: string;
  overview: string;
  features: string;
  warranty: number;
  colors: string;
  instockStatus: InstockStatus;
  description: string;
  type: ProductType;
  dealerPrice: number;
  marketPrice: number;
  discount: number;
  status: string;
  priceUnit: PriceUnit;
  quantity: number;
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


type Status = "all" | "draft" | "pending" | "published"

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
}


type QueryOptionArgs = {
  queryKey: any
  signal: AbortSignal,
  meta: Record<string, unknown> | undefined
}


type LoginResponse = Omit<HttpResponse, "message"> & {accessToken: string};

type UserResponse = Omit<HttpResponse, "message"> & {user: IUser};

type CategoryResponse = Omit<HttpResponse, "message"> & ICategory;

type SalesCategoryResponse = Omit<HttpResponse, "message"> & ISalesCategory;

type ProductResponse = Omit<HttpResponse, "message"> & IProduct;
