import { ProductStatus } from "@prisma/client"
import AppError from "../../appError"


type ProductLifeCycleStateContext = {
  [ProductStatus.Pending]: () => ProductStatus
  [ProductStatus.Published]: () => ProductStatus
  [ProductStatus.Draft]: () => ProductStatus
}

type ProductLifeCycleStatusHandler = () => ProductLifeCycleStateContext


/**
 * Safely attempts to change the state.
 * `Try` mean function may throw
 *
 * @throws {AppError} Throws an error if the state change encounters an issue.
 */
export const handleTryOnDraftProductStatus: ProductLifeCycleStatusHandler = () => ({
  [ProductStatus.Pending]: () => ProductStatus.Pending,
  [ProductStatus.Published]: () => { throw new AppError(403, "Can not publish `Draft` status.") },
  [ProductStatus.Draft]: () => ProductStatus.Draft,
})


/**
 * Safely attempts to change the state.
 * `Try` mean function may throw
 *
 * @throws {AppError} Throws an error if the state change encounters an issue.
 */
export const handleTryOnPendingProductStatus: ProductLifeCycleStatusHandler = () => ({
  [ProductStatus.Pending]: () => ProductStatus.Pending,
  [ProductStatus.Published]: () => ProductStatus.Published,
  [ProductStatus.Draft]: () => ProductStatus.Draft,
})


/**
 * Safely attempts to change the state.
 * `Try` mean function may throw
 *
 * @throws {AppError} Throws an error if the state change encounters an issue.
 */
export const handleTryOnPublishedProductStatus: ProductLifeCycleStatusHandler = () => ({
  [ProductStatus.Pending]: () => { throw new AppError(403, "Published product can not be Pending status.") },
  [ProductStatus.Published]: () => ProductStatus.Published,
  [ProductStatus.Draft]: () => ProductStatus.Draft,
})
