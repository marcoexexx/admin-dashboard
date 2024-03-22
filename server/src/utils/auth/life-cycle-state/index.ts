import { OrderStatus, ProductStatus } from "@prisma/client";
import {
  handleTryOnCancelledOrderStatus,
  handleTryOnDeliveredOrderStatus,
  handleTryOnPendingOrderStatus,
  handleTryOnProcessOrderStatus,
  handleTryOnShippedOrderStatus,
} from "./orderLifeCycleState";
import {
  handleTryOnDraftProductStatus,
  handleTryOnPendingProductStatus,
  handleTryOnPublishedProductStatus,
} from "./productLifeCycleState";

export type LifeCycleProductConcrate = {
  resource: "product";
  state: ProductStatus;
};

export type LifeCycleOrderConcrate = {
  resource: "order";
  state: OrderStatus;
};

type LifeCycleStateConcrate =
  | LifeCycleOrderConcrate
  | LifeCycleProductConcrate;

export class LifeCycleState<T extends LifeCycleStateConcrate> {
  public concrate: T;

  constructor(concrate: T) {
    this.concrate = concrate;
  }

  public changeState(state: T["state"]): T["state"] {
    switch (this.concrate.resource) {
      case "order": {
        const toChangeState = this.changeStateOnOrder(
          state as OrderStatus,
        ) as (
          state: T["state"],
        ) => T["state"];
        return toChangeState(this.concrate.state);
      }

      case "product": {
        const toChangeState = this.changeStateOnProduct(
          state as ProductStatus,
        ) as (
          state: T["state"],
        ) => T["state"];
        return toChangeState(this.concrate.state);
      }

      default: {
        const _: never = this.concrate;
        throw new Error(`Unreachable resource: ${_}`);
      }
    }
  }

  private changeStateOnOrder(
    state: OrderStatus,
  ): (state: OrderStatus) => OrderStatus {
    const context = {
      [OrderStatus.Processing]: handleTryOnProcessOrderStatus()[state],
      [OrderStatus.Pending]: handleTryOnPendingOrderStatus()[state],
      [OrderStatus.Shipped]: handleTryOnShippedOrderStatus()[state],
      [OrderStatus.Delivered]: handleTryOnDeliveredOrderStatus()[state],
      [OrderStatus.Cancelled]: handleTryOnCancelledOrderStatus()[state],
    };
    return (toState: OrderStatus) => context[toState]();
  }

  private changeStateOnProduct(
    state: ProductStatus,
  ): (state: ProductStatus) => ProductStatus {
    const context = {
      [ProductStatus.Pending]: handleTryOnPendingProductStatus()[state],
      [ProductStatus.Published]:
        handleTryOnPublishedProductStatus()[state],
      [ProductStatus.Draft]: handleTryOnDraftProductStatus()[state],
    };
    return (toState: ProductStatus) => context[toState]();
  }
}

/**
 * Debug
 */
if (require.main === module) {
  const productLifeCycleState = new LifeCycleState<
    LifeCycleProductConcrate
  >({
    resource: "product",
    state: ProductStatus.Draft,
  });
  let productState = (() => {
    try {
      return productLifeCycleState.changeState(ProductStatus.Pending);
    } catch (err: any) {
      console.log(err.message);
    }
  })();

  const orderLifeCycleState = new LifeCycleState<LifeCycleOrderConcrate>({
    resource: "order",
    state: OrderStatus.Pending,
  });
  let orderState = (() => {
    try {
      return orderLifeCycleState.changeState(OrderStatus.Shipped);
    } catch (err: any) {
      console.log(err.message);
    }
  })();

  console.log({ orderState, productState });
}
