import { OrderStatus } from "@prisma/client";
import AppError, { StatusCode } from "../../appError";

type OrderLifeCycleStateContext = {
  [OrderStatus.Processing]: () => OrderStatus;
  [OrderStatus.Pending]: () => OrderStatus;
  [OrderStatus.Shipped]: () => OrderStatus;
  [OrderStatus.Cancelled]: () => OrderStatus;
  [OrderStatus.Delivered]: () => OrderStatus;
};

type OrderLifeCycleStatusHandler = () => OrderLifeCycleStateContext;

/**
 * Safely attempts to change the state.
 * `Try` mean function may throw
 *
 * @throws {AppError} Throws an error if the state change encounters an issue.
 */
export const handleTryOnProcessOrderStatus: OrderLifeCycleStatusHandler = () => ({
  [OrderStatus.Processing]: () => OrderStatus.Processing,
  [OrderStatus.Pending]: () => OrderStatus.Pending,
  [OrderStatus.Shipped]: () => {
    throw AppError.new(
      StatusCode.BadRequest,
      "Cannot change the `Shipped` status while the order is in processing.",
    );
  },
  [OrderStatus.Cancelled]: () => OrderStatus.Cancelled,
  [OrderStatus.Delivered]: () => {
    throw AppError.new(
      StatusCode.BadRequest,
      "Cannot change the `delivered` status is not allowed during order processing.",
    );
  },
});

/**
 * Safely attempts to change the state.
 * `Try` mean function may throw
 *
 * @throws {AppError} Throws an error if the state change encounters an issue.
 */
export const handleTryOnPendingOrderStatus: OrderLifeCycleStatusHandler = () => ({
  [OrderStatus.Processing]: () => OrderStatus.Processing,
  [OrderStatus.Pending]: () => OrderStatus.Pending,
  [OrderStatus.Shipped]: () => OrderStatus.Shipped,
  [OrderStatus.Cancelled]: () => OrderStatus.Cancelled,
  [OrderStatus.Delivered]: () => {
    throw AppError.new(
      StatusCode.BadRequest,
      "Unable to mark as delivered while the order is still in a pending state.",
    );
  },
});

/**
 * Safely attempts to change the state.
 * `Try` mean function may throw
 *
 * @throws {AppError} Throws an error if the state change encounters an issue.
 */
export const handleTryOnShippedOrderStatus: OrderLifeCycleStatusHandler = () => ({
  [OrderStatus.Processing]: () => OrderStatus.Processing,
  [OrderStatus.Pending]: () => OrderStatus.Pending,
  [OrderStatus.Shipped]: () => OrderStatus.Shipped,
  [OrderStatus.Cancelled]: () => {
    throw AppError.new(
      StatusCode.BadRequest,
      "Unable to cancel the order as it has already been shipped.",
    );
  },
  [OrderStatus.Delivered]: () => OrderStatus.Delivered,
});

/**
 * Safely attempts to change the state.
 * `Try` mean function may throw
 *
 * @throws {AppError} Throws an error if the state change encounters an issue.
 */
export const handleTryOnCancelledOrderStatus: OrderLifeCycleStatusHandler = () => ({
  [OrderStatus.Processing]: () => OrderStatus.Processing,
  [OrderStatus.Pending]: () => OrderStatus.Pending,
  [OrderStatus.Shipped]: () => {
    throw AppError.new(StatusCode.BadRequest, "Unable to request shipment for a cancelled order.");
  },
  [OrderStatus.Cancelled]: () => OrderStatus.Cancelled,
  [OrderStatus.Delivered]: () => {
    throw AppError.new(StatusCode.BadRequest, "Unable to request delivery for a cancelled order.");
  },
});

/**
 * Safely attempts to change the state.
 * `Try` mean function may throw
 *
 * @throws {AppError} Throws an error if the state change encounters an issue.
 */
export const handleTryOnDeliveredOrderStatus: OrderLifeCycleStatusHandler = () => ({
  [OrderStatus.Processing]: () => OrderStatus.Processing,
  [OrderStatus.Pending]: () => OrderStatus.Pending,
  [OrderStatus.Shipped]: () => OrderStatus.Shipped,
  [OrderStatus.Cancelled]: () => {
    throw AppError.new(
      StatusCode.BadRequest,
      "Unable to cancel the order as it has already been delivered.",
    );
  },
  [OrderStatus.Delivered]: () => OrderStatus.Delivered,
});
