# End point
## /api/v1/


# Brands
## GET: get all brand

### GET ALL: but default pagination is ?pagination[page]=1&pagination[pageSize]=10
- /brands

### GET ALL WITH FILTER
- /brands?filter[name]=brand name

### GET ALL WITH FILTERS:
- /brands?filter[name][equals]=brand name
- /brands?filter[name][equals]=brand title

### GET ALL WITH  RELATIONSHIP
- /brands?include[products]=true

### GET Detail
 - /brands/detail/brand_id


## POST:
### Create new brand
 - /brands
```json
 body: {
    name: brand_name
 }
```

### Create multi brands with excel upload
 - /brands/excel-upload
 ```ts
 // Example
export async function createMultiBrandsFn(buf: ArrayBuffer) {
  const formData = new FormData()

  const blob = new Blob([buf], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' })

  formData.append("excel", blob, `Brands_${Date.now()}.xlsx`)

  const { data } = await authApi.post<HttpResponse>("/brands/excel-upload", formData, {
    headers: {
      "Content-Type": "multipart/form-data"
    }
  })

  return data

}
 ```


## DELETE:
### Delete single brand 
 - /brands/detail/brand_id

### Delete multi brands
 - /brands/multi
 ```json
 body: {
    brandIds: [brand_id, brand_id, ...]
 }
 ```


## PATCH:
### Update brand by id
```json
body: {
    name: string
}
```


---


# Products

### Same as above route
### Available relationships
- *example: /brands?include[relationship_field]=boolean*
- **specifications**: [specification]=true
- **brands**: [brand]=true
- **categories**: [categories][include][category]=true
- **sales categories**: [salesCategory][include][salesCategory]=true
- **liked users**: [likedUsers][include][user]=true

---


# Categories

### Same as above route


---


# SalesCategories

### Same as above route


---


# Exchanges

### Same as above route


---


# Orders

### Same as above route


---


# Users
