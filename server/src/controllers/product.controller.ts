import { Request, Response, NextFunction } from 'express'
import { db } from '../utils/db'
import AppError from '../utils/appError';
import { CreateProductInput, GetProductInput, ProductFilterPagination, UploadImagesProductInput } from '../schemas/product.schema';
import logging from '../middleware/logging/logging';
import { HttpDataResponse, HttpListResponse, HttpResponse } from '../utils/helper';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';
import { convertNumericStrings } from '../utils/convertNumber';


export async function getProductsHandler(
  // TODO: pagination & filter  with relationship
  req: Request<{}, {}, {}, ProductFilterPagination>,
  res: Response,
  next: NextFunction
) {
  try {
    const { filter = {}, pagination } = convertNumericStrings(req.query)
    const {
      id,
      brand,
      brandId,
      title,
      price,
      specification,
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

    const products = await db.product.findMany({
      where: {
        id,
        brand,
        brandId,
        title,
        price,
        specification,
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
      skip: offset,
      take: pageSize,
    })

    res.status(200).json(HttpListResponse(products))
  } catch (err: any) {
    const msg = err?.message || "internal server error"
    logging.error(msg)
    next(new AppError(500, msg))
  }
}


export async function getProductHandler(
  // TODO: pagination & filter
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
    } = req.body;
    const new_product = await db.product.create({
      data: {
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
        status: "Draft",
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
