import { db } from '../utils/db'
import { convertNumericStrings } from '../utils/convertNumber';
import { convertStringToBoolean } from '../utils/convertStringToBoolean';
import { parseExcel } from '../utils/parseExcel';
import { generateUuid } from '../utils/generateUuid';
import { createEventAction } from '../utils/auditLog';
import { Request, Response, NextFunction } from 'express'
import { CreateMultiProductsInput, CreateProductInput, DeleteMultiProductsInput, GetProductInput, GetProductSaleCategoryInput, LikeProductByUserInput, ProductFilterPagination, UpdateProductInput, UploadImagesProductInput } from '../schemas/product.schema';
import { HttpDataResponse, HttpListResponse, HttpResponse } from '../utils/helper';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';
import { LifeCycleProductConcrate, LifeCycleState } from '../utils/auth/life-cycle-state';
import { EventActionType, ProductStatus, Resource } from '@prisma/client';
import { UpdateProductSaleCategoryInput } from '../schemas/salesCategory.schema';

import AppError from '../utils/appError';
import fs from 'fs'
import logging from '../middleware/logging/logging';


// TODO: specification filter
export async function getProductsHandler(
  req: Request<{}, {}, {}, ProductFilterPagination>,
  res: Response,
  next: NextFunction
) {
  try {
    const { filter = {}, pagination, include: includes, orderBy } = convertNumericStrings(req.query)
    const include = convertStringToBoolean(includes) as ProductFilterPagination["include"]
    const {
      id,
      brand,
      brandId,
      title,
      price,
      overview,
      categories,
      instockStatus,
      description,
      discount,
      dealerPrice,
      marketPrice,
      status,
      priceUnit,
      salesCategory,
      likedUsers,
    } = filter || { status: undefined }
    const { page, pageSize } = pagination ??  // ?? nullish coalescing operator, check only `null` or `undefied`
      { page: 1, pageSize: 10 }

    const offset = (page - 1) * pageSize

    const [ count, products ] = await db.$transaction([
      db.product.count(),
      db.product.findMany({
        where: {
          id,
          brand,
          brandId,
          title,
          price,
          overview,
          categories,
          instockStatus,
          description,
          dealerPrice,
          marketPrice,
          status,
          priceUnit,
          salesCategory,
          discount,
          likedUsers,
        },
        orderBy,
        skip: offset,
        take: pageSize,
        include
      })
    ])

    res.status(200).json(HttpListResponse(products, count))
  } catch (err: any) {
    const msg = err?.message || "internal server error"
    logging.error(msg)
    next(new AppError(500, msg))
  }
}


export async function getProductHandler(
  req: Request<GetProductInput, {}, {}>,
  res: Response,
  next: NextFunction
) {
  try {
    const { productId } = req.params

    const { include: includes } = convertNumericStrings(req.query)
    const include = convertStringToBoolean(includes) as ProductFilterPagination["include"]

    const product = await db.product.findUnique({
      where: {
        id: productId
      },
      include
    })

    if (!product) return next(new AppError(404, "Product not found"))

    // Read event action audit log
    if (product) {
      if (req?.user?.id) createEventAction(db, {
        userId: req.user.id,
        resource: Resource.Product,
        resourceIds: [product.id],
        action: EventActionType.Read
      })
    }

    res.status(200).json(HttpDataResponse({ product }))
  } catch (err: any) {
    const msg = err?.message || "internal server error"
    logging.error(msg)
    next(new AppError(500, msg))
  }
}


export async function createProductHandler(
  req: Request<{}, {}, CreateProductInput>,
  res: Response,
  next: NextFunction
) {
  try {
    const {
      price,
      brandId,
      title,
      specification,
      overview,
      instockStatus,
      description,
      dealerPrice,
      marketPrice,
      priceUnit,
      salesCategory,
      categories,
      quantity,
      discount,
      status
    } = req.body;

    // @ts-ignore  for mocha testing
    const user = req.user

    if (!user) return next(new AppError(400, "Session has expired or user doesn't exist"))

    const new_product = await db.product.create({
      data: {
        price,
        brandId,
        title,
        specification: {
          create: specification
        },
        overview,
        instockStatus,
        description,
        dealerPrice,
        marketPrice,
        status,
        priceUnit,
        categories: {
          create: categories.map(id => ({
            category: {
              connect: { id }
            }
          }))
        },
        salesCategory: {
          create: (salesCategory || []).map(({ salesCategory: salesCategoryId, discount }) => ({
            salesCategory: { connect: { id: salesCategoryId } },
            discount
          }))
        },
        quantity,
        discount,
        creatorId: user.id
      }
    })

    // Create event action audit log
    if (req?.user?.id) createEventAction(db, {
      userId: req.user.id,
      resource: Resource.Product,
      resourceIds: [new_product.id],
      action: EventActionType.Create
    })

    res.status(201).json(HttpDataResponse({ product: new_product }))
  } catch (err: any) {
    const msg = err?.message || "internal server error"
    logging.error(msg)

    if (err instanceof PrismaClientKnownRequestError && err.code === "P2002") return next(new AppError(409, "Category name already exists"))

    next(new AppError(500, msg))
  }
}


export async function createMultiProductsHandler(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    // @ts-ignore  for mocha testing
    const user = req.user

    if (!user) return next(new AppError(400, "Session has expired or user doesn't exist"))

    const excelFile = req.file

    if (!excelFile) return res.status(204)

    const buf = fs.readFileSync(excelFile.path)
    const data = parseExcel(buf) as CreateMultiProductsInput

    const products = await Promise.all(data.map(product => {
      const sale = (product["sales.name"] && product["sales.discount"]) ? {
        name: product["sales.name"].toString(),
        startDate: product["sales.startDate"] || new Date(),
        get endDate() { return product["sales.endDate"] || new Date(new Date(this.startDate).getTime() + 1000 * 60 * 60 * 24 * 5) }, // default: 5 days
        discount: product["sales.discount"],
        isActive: product["sales.isActive"] || true,
        description: product["sales.description"],
      } : null

      const task = db.product.upsert({
        where: {
          id: product.id || generateUuid()
        },
        create: {
          title: product.title,
          overview: product.overview,
          instockStatus: product.instockStatus,
          description: product.description,
          price: product.price,
          dealerPrice: product.dealerPrice,
          marketPrice: product.marketPrice,
          status: product.status,
          priceUnit: product.priceUnit,
          images: (product?.images || "")?.split("\n").filter(Boolean),
          quantity: product.quantity,
          discount: product.discount,
          brand: {
            connectOrCreate: {
              where: { name: product["brand.name"] },
              create: { name: product["brand.name"] }
            }
          },
          creator: {
            connect: { 
              id: user.id 
            }
          },
          salesCategory: {
            create: sale ? {
              salesCategory: { 
                connectOrCreate: {
                  where: { name: sale.name },
                  create: { 
                    name: sale.name, 
                    startDate: sale.startDate, 
                    endDate: sale.endDate,
                    isActive: sale.isActive,
                    description: sale.description
                  }
                } 
              },
              discount: sale.discount,
            } : undefined,
          },
          specification: product.specification ? {
            createMany: {
              data: product.specification.split("\n").filter(Boolean).map(spec => ({ name: spec.split(": ")[0], value: spec.split(": ")[1] })),
            }
          } : undefined,
          categories: {
            create: (product.categories || "").split("\n").filter(Boolean).map(name => ({
              category: {
                connectOrCreate: {
                  where: { name },
                  create: { name }
                }
              }
            }))
          },
        },
        update: {
          price: product.price,
          dealerPrice: product.dealerPrice,
          marketPrice: product.marketPrice,
          salesCategory: {
            create: sale ? {
              salesCategory: { 
                connectOrCreate: {
                  where: { name: sale.name },
                  create: { 
                    name: sale.name, 
                    startDate: sale.startDate, 
                    endDate: sale.endDate,
                    isActive: sale.isActive,
                    description: sale.description
                  }
                } 
              },
              discount: sale.discount,
            } : undefined,
          },
        },
      })

      return task
    }))

    // Create event action audit log
    if (req?.user?.id) createEventAction(db, {
      userId: req.user.id,
      resource: Resource.Product,
      resourceIds: products.map(product => product.id),
      action: EventActionType.Create
    })

    res.status(201).json(HttpResponse(201, "Success"))
  } catch (err: any) {
    const msg = err?.message || "internal server error"
    logging.error(msg)

    if (err instanceof PrismaClientKnownRequestError && err.code === "P2002") return next(new AppError(409, "Exchange already exists"))

    next(new AppError(500, msg))
  }
}


export async function deleteProductSaleCategoryHandler(
  req: Request<GetProductSaleCategoryInput["params"]>,
  res: Response,
  next: NextFunction
) {
  try {
    const { productId, productSaleCategoryId } = req.params

    await db.productSalesCategory.delete({
      where: {
        id: productSaleCategoryId,
        productId
      }
    })

    // It remove sale form product, it is update product
    // Update event action audit log
    if (req?.user?.id) createEventAction(db, {
      userId: req.user.id,
      resource: Resource.Product,
      resourceIds: [productId],
      action: EventActionType.Update
    })

    res.status(200).json(HttpResponse(200, "Success delete"))
  } catch (err: any) {
    const msg = err?.message || "internal server error"
    logging.error(msg)
    if (err?.code === "23505") next(new AppError(409, "data already exists"))
    next(new AppError(500, msg))
  }
}


export async function updateProductSalesCategoryHandler(
  req: Request<UpdateProductSaleCategoryInput["params"], {}, UpdateProductSaleCategoryInput["body"]>,
  res: Response,
  next: NextFunction
) {
  try {
    const { productSaleCategoryId } = req.params
    const { discount } = req.body

    const productSalesCategory = await db.productSalesCategory.update({
      where: {
        id: productSaleCategoryId
      },
      data: {
        discount
      },
      include: {
        salesCategory: true
      }
    })

    // It update sale form product, it is update product
    // Update event action audit log
    if (req?.user?.id) createEventAction(db, {
      userId: req.user.id,
      resource: Resource.Product,
      resourceIds: [productSalesCategory.productId],
      action: EventActionType.Update
    })

    res.status(200).json(HttpDataResponse({ productSalesCategory }))
  } catch (err: any) {
    const msg = err?.message || "internal server error"
    logging.error(msg)
    if (err?.code === "23505") next(new AppError(409, "data already exists"))
    next(new AppError(500, msg))
  }
}


export async function deleteProductHandler(
  req: Request<GetProductInput>,
  res: Response,
  next: NextFunction
) {
  try {
    const { productId } = req.params

    const product = await db.product.findUnique({
      where: {
        id: productId,
        status: ProductStatus.Draft
      },
      select: {
        status: true
      }
    })

    if (!product) return next(new AppError(403,  `Deletion is restricted for product in non-drift states.`))

    const [_deletedSpes, _deletedFav, _deletedCate, _deletedSale, deledtedProduct] = await db.$transaction([
      // remove association data(s)
      db.specification.deleteMany({
        where: {
          productId,
          product: {
            status: ProductStatus.Draft
          }
        }
      }),
      db.favorites.deleteMany({
        where: {
          productId,
          product: {
            status: ProductStatus.Draft
          }
        }
      }),
      db.productCategory.deleteMany({
        where: {
          productId,
          product: {
            status: ProductStatus.Draft
          }
        }
      }),
      db.productSalesCategory.deleteMany({
        where: {
          productId,
          product: {
            status: ProductStatus.Draft
          }
        }
      }),

      // remove real data
      db.product.delete({
        where: {
          id: productId,
          status: ProductStatus.Draft
        }
      })
    ])

    // Delete event action audit log
    if (req?.user?.id) createEventAction(db, {
      userId: req.user.id,
      resource: Resource.Product,
      resourceIds: [deledtedProduct.id],
      action: EventActionType.Delete
    })

    res.status(200).json(HttpResponse(200, "Success delete"))
  } catch (err: any) {
    const msg = err?.message || "internal server error"
    logging.error(msg)
    if (err?.code === "23505") next(new AppError(409, "data already exists"))
    next(new AppError(500, msg))
  }
}


export async function deleteMultiProductHandler(
  req: Request<{}, {}, DeleteMultiProductsInput>,
  res: Response,
  next: NextFunction
) {
  try {
    const { productIds } = req.body

    await db.$transaction([
      db.specification.deleteMany({
        where: {
          productId: {
            in: productIds
          },
          product: {
            status: ProductStatus.Draft
          }
        }
      }),
      db.favorites.deleteMany({
        where: {
          productId: {
            in: productIds
          },
          product: {
            status: ProductStatus.Draft
          }
        }
      }),
      db.productCategory.deleteMany({
        where: {
          productId: {
            in: productIds
          },
          product: {
            status: ProductStatus.Draft
          }
        }
      }),
      db.productSalesCategory.deleteMany({
        where: {
          productId: {
            in: productIds
          },
          product: {
            status: ProductStatus.Draft
          }
        }
      }),
      db.product.deleteMany({
        where: {
          id: {
            in: productIds
          },
          status: ProductStatus.Draft
        }
      })
    ])

    // Delete event action audit log
    if (req?.user?.id) createEventAction(db, {
      userId: req.user.id,
      resource: Resource.Product,
      resourceIds: productIds,
      action: EventActionType.Delete
    })

    res.status(200).json(HttpResponse(200, "Success delete"))
  } catch (err: any) {
    const msg = err?.message || "internal server error"
    logging.error(msg)
    if (err?.code === "23505") next(new AppError(409, "data already exists"))
    next(new AppError(500, msg))
  }
}


export async function updateProductHandler(
  req: Request<UpdateProductInput["params"], {}, UpdateProductInput["body"]>,
  res: Response,
  next: NextFunction
) {
  try {
    const { productId } = req.params
    const {
      price,
      brandId,
      title,
      specification,
      overview,
      instockStatus,
      description,
      dealerPrice,
      marketPrice,
      priceUnit,
      categories,
      status
    } = req.body

    const originalProductState = await db.product.findUnique({
      where: {
        id: productId,
      },
      select: {
        status: true
      }
    })

    if (!originalProductState) return next(new AppError(404, "Product not found."))

    const productLifeCycleState = new LifeCycleState<LifeCycleProductConcrate>({ resource: "product", state: originalProductState.status })
    const productState = productLifeCycleState.changeState(status)

    const [_deletedProductCategory, _deletedProductSpecificationm, product] = await db.$transaction([
      // remove association data(s)
      db.productCategory.deleteMany({
        where: {
          productId,
        }
      }),
      db.product.update({
        where: {
          id: productId,
        },
        data: {
          specification: {
            deleteMany: {
              productId
            }
          }
        }
      }),

      // Update real
      db.product.update({
        where: {
          id: productId,
        },
        data: {
          price,
          brandId,
          title,
          specification: {
            create: (specification || []).map(spec => ({ name: spec.name, value: spec.value }))
          },
          overview,
          instockStatus,
          description,
          dealerPrice,
          marketPrice,
          status: productState,
          priceUnit,
          categories: {
            create: categories.map(id => ({
              category: {
                connect: { id }
              }
            }))
          },
        }
      })
    ])

    // Update event action audit log
    if (req?.user?.id) createEventAction(db, {
      userId: req.user.id,
      resource: Resource.Product,
      resourceIds: [product.id],
      action: EventActionType.Update
    })

    res.status(200).json(HttpDataResponse({ product }))
  } catch (err: any) {
    const msg = err?.message || "internal server error"
    const status = err?.status || 500

    logging.error(msg)
    next(new AppError(status, msg))
  }
}


export async function uploadImagesProductHandler(
  req: Request<GetProductInput, {}, UploadImagesProductInput>,
  res: Response,
  next: NextFunction
) {
  try {
    const { productId } = req.params
    const { images } = req.body

    const product = await db.product.update({
      where: {
        id: productId
      },
      data: {
        images: {
          push: images,
        }
      }
    })

    // Update event action audit log
    if (req?.user?.id) createEventAction(db, {
      userId: req.user.id,
      resource: Resource.Product,
      resourceIds: [product.id],
      action: EventActionType.Update
    })

    res.status(200).json(HttpListResponse(images))
  } catch (err) {
    next(err)
  }
}


export async function likeProductByUserHandler(
  req: Request<LikeProductByUserInput["params"], {}, LikeProductByUserInput["body"]>,
  res: Response,
  next: NextFunction
) {
  try {
    const { productId } = req.params
    const { userId } = req.body

    const product = await db.product.update({
      where: { id: productId },
      data: {
        likedUsers: {
          create: {
            userId: userId
          }
        }
      }
    })

    // // TODO: liked products
    // // Update event action audit log
    // createEventAction(db, {
    //   userId: req.user?.id,
    //   resource: Resource.Product,
    //   resourceIds: [product.id],
    //   action: EventActionType.Update
    // })

    res.status(200).json(HttpDataResponse({ product }))
  } catch (err) {
    next(err)
  }
}


export async function unLikeProductByUserHandler(
  req: Request<LikeProductByUserInput["params"], {}, LikeProductByUserInput["body"]>,
  res: Response,
  next: NextFunction
) {
  try {
    const { productId } = req.params
    const { userId } = req.body

    await db.favorites.deleteMany({
      where: {
        productId,
        userId
      }
    })

    // // TODO: unliked products
    // // Update event action audit log
    // createEventAction(db, {
    //   userId: req.user?.id,
    //   resource: Resource.Product,
    //   resourceIds: [productId],
    //   action: EventActionType.Update
    // })

    res.status(200).json(HttpResponse(200, "Success Unlike"))
  } catch (err) {
    next(err)
  }
}
