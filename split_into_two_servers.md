# Split into two servers

---

## Client

### Website
 - order            -> api/v1/rangoon/orders                -> [GET, POST, PATCH, DELETE]
 - user (User)      -> api/v1/rangoon/users                 -> [GET, POST, PATCH, DELETE]

 - products         -> api/v1/dashboard/products            -> [GET]
 - product-reviews  -> api/v1/dashboard/product-reviews     -> [GET, POST, PATCH, DELETE]
 - categories       -> api/v1/dashboard/categories          -> [GET]
 - sales-categories -> api/v1/dashboard/sales-categories    -> [GET]

### Dashboard
 - order                        -> api/v1/rangoon/orders                -> [GET, POST, PATCH, DELETE]
 - user (User, Admin, Empoyee)  -> api/v1/rangoon/users                 -> [GET, POST, PATCH, DELETE]

 - products                     -> api/v1/dashboard/products            -> [GET, POST, PATCH, DELETE]
 - categories                   -> api/v1/dashboard/categories          -> [GET, POST, PATCH, DELETE]
 - sales-categories             -> api/v1/dashboard/sales-categories    -> [GET, POST, PATCH, DELETE]


---

## Server

### Backend for Website
 - order
 - user

### Backend for Dashboard
 - products
 - categories
 - sales-categories


---

## Database

### MongoDB or PostgresQL

### RedisDB (optional)
