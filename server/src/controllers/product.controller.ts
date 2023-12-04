import { Request, Response, NextFunction } from 'express'
import { db } from '../utils/db'
import AppError from '../utils/appError';
import { CreateMultiProductsInput, CreateProductInput, GetProductInput, ProductFilterPagination, UpdateProductInput, UploadImagesProductInput } from '../schemas/product.schema';
import logging from '../middleware/logging/logging';
import { HttpDataResponse, HttpListResponse, HttpResponse } from '../utils/helper';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';
import { convertNumericStrings } from '../utils/convertNumber';
import { convertStringToBoolean } from '../utils/convertStringToBoolean';


// TODO: specification filter
export async function getProductsHandler(
  req: Request<{}, {}, {}, ProductFilterPagination>,
  res: Response,
  next: NextFunction
) {
  try {
    const { filter = {}, pagination, include: includes, orderBy } = convertNumericStrings(req.query)
    const include = convertStringToBoolean(includes)
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
      type,
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
          type,
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
        // @ts-ignore
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

    const product = await db.product.findUnique({
      where: {
        id: productId
      }
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
      type,
      dealerPrice,
      marketPrice,
      discount,
      priceUnit,
      salesCategory,
      categories,
      quantity,
      status
    } = req.body;
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
        type,
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
    res.status(201).json(HttpDataResponse({ product: new_product }))
  } catch (err: any) {
    const msg = err?.message || "internal server error"
    logging.error(msg)

    if (err instanceof PrismaClientKnownRequestError && err.code === "P2002") return next(new AppError(409, "Category name already exists"))

    next(new AppError(500, msg))
  }
}


export async function createMultiProductsHandler(
  req: Request<{}, {}, CreateMultiProductsInput>,
  res: Response,
  next: NextFunction
) {
  try {
    const data = req.body
    await db.product.createMany({
      data,
      skipDuplicates: true
    })

    res.status(200).json(HttpResponse(200, "Success"))
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

    logging.log(await db.specification.count())

    await db.specification.deleteMany({
      where: {
        productId,
      }
    })

    await db.productCategory.deleteMany({
      where: {
        productId,
      }
    })

    await db.productSalesCategory.deleteMany({
      where: {
        productId,
      }
    })

    await db.product.delete({
      where: {
        id: productId
      }
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
      features,
      warranty,
      colors,
      instockStatus,
      description,
      type,
      dealerPrice,
      marketPrice,
      discount,
      priceUnit,
      salesCategory,
      categories,
      quantity,
      status
    } = req.body

    await db.productCategory.deleteMany({
      where: {
        productId,
      }
    })

    await db.productSalesCategory.deleteMany({
      where: {
        productId,
      }
    })

    await db.specification.deleteMany({
      where: {
        productId
      }
    })

    const product = await db.product.update({
      where: {
        id: productId
      },
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
        type,
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
