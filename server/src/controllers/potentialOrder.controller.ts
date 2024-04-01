import { checkUser } from "../services/checkUser";
import { convertNumericStrings } from "../utils/convertNumber";
import { convertStringToBoolean } from "../utils/convertStringToBoolean";

import { OperationAction } from "@prisma/client";
import { NextFunction, Request, Response } from "express";
import {
  CreatePotentialOrderInput,
  DeleteMultiPotentialOrdersInput,
  GetPotentialOrderInput,
  UpdatePotentialOrderInput,
} from "../schemas/potentialOrder.schema";
import { PotentialOrderService } from "../services/potentialOrder";
import { StatusCode } from "../utils/appError";
import {
  HttpDataResponse,
  HttpListResponse,
  HttpResponse,
} from "../utils/helper";

const service = PotentialOrderService.new();

export async function getPotentialOrdersHandler(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const query = convertNumericStrings(req.query);

    const { id, startDate, endDate, status, totalPrice, remark } =
      query.filter ?? {};
    const { page, pageSize } = query.pagination ?? {};
    const {
      _count,
      user,
      deliveryAddress,
      billingAddress,
      pickupAddress,
      orderItems,
    } = convertStringToBoolean(query.include) ?? {};
    const orderBy = query.orderBy ?? {};

    const sessionUser = checkUser(req?.user).ok();
    const _isAccess = await service.checkPermissions(
      sessionUser,
      OperationAction.Read,
    );
    _isAccess.ok_or_throw();

    const [count, potentialOrders] = (await service.tryFindManyWithCount(
      {
        pagination: { page, pageSize },
      },
      {
        where: {
          id,
          updatedAt: {
            gte: startDate,
            lte: endDate,
          },
          status,
          totalPrice,
          remark,
        },
        include: {
          _count,
          user,
          deliveryAddress,
          billingAddress,
          pickupAddress,
          orderItems,
        },
        orderBy,
      },
    )).ok_or_throw();

    res.status(StatusCode.OK).json(
      HttpListResponse(potentialOrders, count, {
        meta: {
          filter: { id, startDate, endDate, status, totalPrice, remark },
          include: {
            _count,
            user,
            deliveryAddress,
            billingAddress,
            pickupAddress,
            orderItems,
          },
          page,
          pageSize,
        },
      }),
    );
  } catch (err) {
    next(err);
  }
}

export async function getPotentialOrderHandler(
  req: Request<GetPotentialOrderInput["params"]>,
  res: Response,
  next: NextFunction,
) {
  try {
    const query = convertNumericStrings(req.query);

    const { potentialOrderId } = req.params;
    const {
      _count,
      user,
      deliveryAddress,
      billingAddress,
      pickupAddress,
      orderItems,
    } = convertStringToBoolean(query.include) ?? {};

    const sessionUser = checkUser(req?.user).ok();
    const _isAccess = await service.checkPermissions(
      sessionUser,
      OperationAction.Read,
    );
    _isAccess.ok_or_throw();

    const potentialOrder = (await service.tryFindUnique({
      where: {
        id: potentialOrderId,
      },
      include: {
        _count,
        user,
        deliveryAddress,
        billingAddress,
        pickupAddress,
        orderItems,
      },
    })).ok_or_throw()!;

    // Create audit log
    if (potentialOrder && sessionUser) {
      (await service.audit(sessionUser)).ok_or_throw();
    }

    res.status(StatusCode.OK).json(
      HttpDataResponse({ potentialOrder }, {
        meta: {
          id: potentialOrder.id,
          include: {
            _count,
            user,
            deliveryAddress,
            billingAddress,
            pickupAddress,
            orderItems,
          },
        },
      }),
    );
  } catch (err) {
    next(err);
  }
}

export async function createPotentialOrderHandler(
  req: Request<{}, {}, CreatePotentialOrderInput>,
  res: Response,
  next: NextFunction,
) {
  try {
    const {
      id,
      orderItems,
      totalPrice,
      addressType,
      deliveryAddressId,
      billingAddressId,
      pickupAddressId,
      status,
      paymentMethodProvider,
      remark,
    } = req.body;

    const sessionUser = checkUser(req?.user).ok();
    const _isAccess = await service.checkPermissions(
      sessionUser,
      OperationAction.Create,
    );
    _isAccess.ok_or_throw();

    const potentialOrder = (await service.tryUpsert({
      where: {
        id,
      },
      create: {
        addressType,
        orderItems: {
          connect: orderItems.map(orderItemId => ({ id: orderItemId })),
        },
        userId: sessionUser?.id,
        status,
        totalPrice,
        deliveryAddressId,
        billingAddressId,
        pickupAddressId,
        paymentMethodProvider,
      },
      update: {
        addressType,
        // WARN: order items not affected
        status,
        totalPrice,
        deliveryAddressId,
        billingAddressId,
        pickupAddressId,
        paymentMethodProvider,
        remark,
      },
    })).ok_or_throw();

    // Create audit log
    if (sessionUser) (await service.audit(sessionUser)).ok_or_throw();

    res.status(StatusCode.Created).json(
      HttpDataResponse({ potentialOrder }, {
        meta: { id: potentialOrder.id },
      }),
    );
  } catch (err) {
    console.log("Err:", err);
    next(err);
  }
}

export async function deletePotentialOrderHandler(
  req: Request<GetPotentialOrderInput["params"]>,
  res: Response,
  next: NextFunction,
) {
  try {
    const { potentialOrderId } = req.params;

    const sessionUser = checkUser(req?.user).ok();
    const _isAccess = await service.checkPermissions(
      sessionUser,
      OperationAction.Delete,
    );
    _isAccess.ok_or_throw();

    const potentialOrder = (await service.tryDelete({
      where: {
        id: potentialOrderId,
      },
    })).ok_or_throw();

    // Create audit log
    const _auditLog = await service.audit(sessionUser);
    _auditLog.ok_or_throw();

    res.status(StatusCode.OK).json(
      HttpDataResponse({ potentialOrder }, {
        meta: { id: potentialOrder.id },
      }),
    );
  } catch (err) {
    next(err);
  }
}

export async function deleteMultiPotentialOrdersHandler(
  req: Request<{}, {}, DeleteMultiPotentialOrdersInput>,
  res: Response,
  next: NextFunction,
) {
  try {
    const { potentialOrderIds } = req.body;

    const sessionUser = checkUser(req?.user).ok();
    const _isAccess = await service.checkPermissions(
      sessionUser,
      OperationAction.Delete,
    );
    _isAccess.ok_or_throw();

    const _deleteOrders = await service.tryDeleteMany({
      where: {
        id: {
          in: potentialOrderIds,
        },
      },
    });
    _deleteOrders.ok_or_throw();

    // Create audit log
    const _auditLog = await service.audit(sessionUser);
    _auditLog.ok_or_throw();

    res.status(StatusCode.OK).json(
      HttpResponse(StatusCode.OK, "Success deleted"),
    );
  } catch (err) {
    next(err);
  }
}

export async function updatePotentialOrderHandler(
  req: Request<
    UpdatePotentialOrderInput["params"],
    {},
    UpdatePotentialOrderInput["body"]
  >,
  res: Response,
  next: NextFunction,
) {
  try {
    const { potentialOrderId } = req.params;
    const data = req.body;

    // @ts-ignore  for mocha testing
    const userId: string | undefined = req.user?.id || undefined;

    const sessionUser = checkUser(req?.user).ok();
    const _isAccess = await service.checkPermissions(
      sessionUser,
      OperationAction.Update,
    );
    _isAccess.ok_or_throw();

    const potentialOrder = (await service.tryUpdate({
      where: {
        id: potentialOrderId,
      },
      data: {
        totalPrice: data.totalPrice,
        userId,
        addressType: data.addressType,
        status: data.status,
        deliveryAddressId: data.deliveryAddressId,
        billingAddressId: data.billingAddressId,
        paymentMethodProvider: data.paymentMethodProvider,
        remark: data.remark,
      },
    })).ok_or_throw();

    // Create audit log
    if (sessionUser) {
      const _auditLog = await service.audit(sessionUser);
      _auditLog.ok_or_throw();
    }

    res.status(StatusCode.OK).json(
      HttpDataResponse({ potentialOrder }, {
        meta: { id: potentialOrder.id },
      }),
    );
  } catch (err) {
    next(err);
  }
}
