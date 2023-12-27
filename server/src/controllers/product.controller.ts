import { Request, Response, NextFunction } from 'express'
import { CreateMultiProductsInput, CreateProductInput, DeleteMultiProductsInput, GetProductInput, LikeProductByUserInput, ProductFilterPagination, UpdateProductInput, UploadImagesProductInput } from '../schemas/product.schema';
import { HttpDataResponse, HttpListResponse, HttpResponse } from '../utils/helper';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';
import { db } from '../utils/db'
import { convertNumericStrings } from '../utils/convertNumber';
import { convertStringToBoolean } from '../utils/convertStringToBoolean';
import logging from '../middleware/logging/logging';
import fs from 'fs'
import AppError from '../utils/appError';
import { parseExcel } from '../utils/parseExcel';


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
      features,
      warranty,
      categories,
      colors,
      instockStatus,
      description,
      dealerPrice,
      marketPrice,
      discount,
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
          features,
          warranty,
          categories,
          colors,
          instockStatus,
          description,
          dealerPrice,
          marketPrice,
          discount,
          status,
          priceUnit,
          salesCategory,
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
      features,
      warranty,
      colors,
      instockStatus,
      description,
      dealerPrice,
      marketPrice,
      discount,
      priceUnit,
      salesCategory,
      categories,
      quantity,
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
        features,
        warranty,
        colors,
        instockStatus,
        description,
        dealerPrice,
        marketPrice,
        discount,
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
          create: salesCategory.map(id => ({
            salesCategory: {
              connect: { id }
            }
          }))
        },
        quantity,
        creatorId: user.id
      }
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

    await Promise.all(data.map(product => {
      return db.product.upsert({
        where: {
          id: product.id
        },
        create: {
          id: product.id,
          title: product.title,
          overview: product.overview,
          features: product?.features || "<h1>Product features</h1>",
          warranty: product.warranty,
          colors: (product?.colors || "")?.split("\n").filter(Boolean),
          instockStatus: product.instockStatus,
          description: product?.description || "<h1>Product description</h1>",
          price: product.price,
          dealerPrice: product.dealerPrice,
          marketPrice: product.marketPrice,
          discount: product.discount,
          status: product.status,
          priceUnit: product.priceUnit,
          images: (product?.images || "")?.split("\n").filter(Boolean),
          quantity: product.quantity,
          brand: {
            connectOrCreate: {
              where: { name: product.brandName },
              create: { name: product.brandName }
            }
          },
          creator: {
            connect: { 
              id: user.id 
            }
          },
          specification: product.specification ? {
            createMany: {
              data: product.specification.split("\n").filter(Boolean).map(spec => ({ name: spec.split(": ")[0], value: spec.split(": ")[1] })),
              // skipDuplicates: true
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
          salesCategory: {
            create: (product.salesCategory || "").split("\n").filter(Boolean).map(name => ({
              salesCategory: {
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
          discount: product.discount,
        },
      })
    }))

    res.status(201).json(HttpResponse(201, "Success"))
  } catch (err: any) {
    const msg = err?.message || "internal server error"
    logging.error(msg)

    if (err instanceof PrismaClientKnownRequestError && err.code === "P2002") return next(new AppError(409, "Exchange already exists"))

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
        id: productId
      }
    })

    if (!product) return next(new AppError(404,  `Product not found`))

    await db.$transaction([
      // remove association data(s)
      db.specification.deleteMany({
        where: {
          productId,
        }
      }),
      db.favorites.deleteMany({
        where: {
          productId,
        }
      }),
      db.productCategory.deleteMany({
        where: {
          productId,
        }
      }),
      db.productSalesCategory.deleteMany({
        where: {
          productId,
        }
      }),

      // remove real data
      db.product.delete({
        where: {
          id: productId
        }
      })
    ])

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
        }
      }),
      db.favorites.deleteMany({
        where: {
          productId: {
            in: productIds
          },
        }
      }),
      db.productCategory.deleteMany({
        where: {
          productId: {
            in: productIds
          },
        }
      }),
      db.productSalesCategory.deleteMany({
        where: {
          productId: {
            in: productIds
          },
        }
      }),
      db.product.deleteMany({
        where: {
          id: {
            in: productIds
          },
        }
      })
    ])

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
      features,
      warranty,
      colors,
      instockStatus,
      description,
      dealerPrice,
      marketPrice,
      discount,
      priceUnit,
      salesCategory,
      categories,
      quantity,
      status
    } = req.body

    const [_deletedProductCategory, _daletedProductSalesCategory, _deletedProductSpecificationm, product] = await db.$transaction([
      // remove association data(s)
      db.productCategory.deleteMany({
        where: {
          productId,
        }
      }),
      db.productSalesCategory.deleteMany({
        where: {
          productId,
        }
      }),
      db.product.update({
        where: {
          id: productId
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
          id: productId
        },
        data: {
          price,
          brandId,
          title,
          specification: {
            create: (specification || []).map(spec => ({ name: spec.name, value: spec.value }))
          },
          overview,
          features,
          warranty,
          colors,
          instockStatus,
          description,
          dealerPrice,
          marketPrice,
          discount,
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
            create: salesCategory.map(id => ({
              salesCategory: {
                connect: { id }
              }
            }))
          },
          quantity,
        }
      })
    ])

    res.status(200).json(HttpDataResponse({ product }))
  } catch (err) {
    next(err)
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

    await db.product.update({
      where: {
        id: productId
      },
      data: {
        images: {
          push: images,
        }
      }
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

    // const product = await db.product.update({
    //   where: { id: productId },
    //   data: {
    //     likedUsers: {
    //       create: {
    //         userId: userId
    //       }
    //     }
    //   }
    // })

    res.status(200).json(HttpResponse(200, "Success Unlike"))
  } catch (err) {
    next(err)
  }
}
