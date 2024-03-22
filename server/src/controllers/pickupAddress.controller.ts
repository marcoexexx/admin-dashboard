import { OperationAction } from "@prisma/client";
import { NextFunction, Request, Response } from "express";
import {
  CreatePickupAddressInput,
  DeleteMultiPickupAddressesInput,
  GetPickupAddressInput,
} from "../schemas/pickupAddress.schema";
import { checkUser } from "../services/checkUser";
import { PickupAddressService } from "../services/pickupAddress";
import { StatusCode } from "../utils/appError";
import { convertNumericStrings } from "../utils/convertNumber";
import { convertStringToBoolean } from "../utils/convertStringToBoolean";
import {
  HttpDataResponse,
  HttpListResponse,
  HttpResponse,
} from "../utils/helper";

const service = PickupAddressService.new();

export async function getPickupAddressesHandler(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const query = convertNumericStrings(req.query);

    const { id, username, phone, email } = query.filter ?? {};
    const { page, pageSize } = query.pagination ?? {};
    const { _count, user, orders, potentialOrders } =
      convertStringToBoolean(query.include) ?? {};
    const orderBy = query.orderBy ?? {};

    const sessionUser = checkUser(req?.user).ok();
    const _isAccess = await service.checkPermissions(
      sessionUser,
      OperationAction.Read,
    );
    _isAccess.ok_or_throw();

    if (!sessionUser) {
      return res.status(StatusCode.OK).json(HttpListResponse([], 0));
    }

    const [count, pickupAddresses] = (await service.tryFindManyWithCount(
      {
        pagination: { page, pageSize },
      },
      {
        where: { id, username, phone, email, userId: sessionUser.id },
        include: { _count, user, orders, potentialOrders },
        orderBy,
      },
    )).ok_or_throw();

    res.status(StatusCode.OK).json(
      HttpListResponse(pickupAddresses, count),
    );
  } catch (err) {
    next(err);
  }
}

export async function getPickupAddressHandler(
  req: Request<GetPickupAddressInput["params"]>,
  res: Response,
  next: NextFunction,
) {
  try {
    const query = convertNumericStrings(req.query);

    const { pickupAddressId } = req.params;
    const { _count, user, orders, potentialOrders } =
      convertStringToBoolean(query.include) ?? {};

    const sessionUser = checkUser(req?.user).ok();
    const _isAccess = await service.checkPermissions(
      sessionUser,
      OperationAction.Read,
    );
    _isAccess.ok_or_throw();

    const pickupAddress = (await service.tryFindUnique({
      where: { id: pickupAddressId },
      include: { _count, user, orders, potentialOrders },
    })).ok_or_throw();

    // Create audit log
    if (pickupAddress && sessionUser) {
      (await service.audit(sessionUser)).ok_or_throw();
    }

    res.status(StatusCode.OK).json(HttpDataResponse({ pickupAddress }));
  } catch (err) {
    next(err);
  }
}

export async function createPickupAddressHandler(
  req: Request<{}, {}, CreatePickupAddressInput>,
  res: Response,
  next: NextFunction,
) {
  try {
    const { username, phone, email, date } = req.body;

    // @ts-ignore  for mocha testing
    const sessionUser = checkUser(req?.user).ok_or_throw();
    const _isAccess = await service.checkPermissions(
      sessionUser,
      OperationAction.Create,
    );
    _isAccess.ok_or_throw();

    const pickupAddress = (await service.tryCreate({
      data: {
        username,
        phone,
        email,
        date,
        userId: sessionUser.id,
      },
    })).ok_or_throw();

    // Create audit log
    const _auditLog = await service.audit(sessionUser);
    _auditLog.ok_or_throw();

    res.status(StatusCode.Created).json(
      HttpDataResponse({ pickupAddress }),
    );
  } catch (err) {
    next(err);
  }
}

export async function deletePickupAddressHandler(
  req: Request<GetPickupAddressInput["params"]>,
  res: Response,
  next: NextFunction,
) {
  try {
    const { pickupAddressId } = req.params;

    const sessionUser = checkUser(req?.user).ok_or_throw();
    const _isAccess = await service.checkPermissions(
      sessionUser,
      OperationAction.Delete,
    );
    _isAccess.ok_or_throw();

    const pickupAddress =
      (await service.tryDelete({ where: { id: pickupAddressId } }))
        .ok_or_throw();

    // Create audit log
    const _auditLog = await service.audit(sessionUser);
    _auditLog.ok_or_throw();

    res.status(StatusCode.OK).json(HttpDataResponse({ pickupAddress }));
  } catch (err) {
    next(err);
  }
}

export async function deleteMultiPickupAddressesHandler(
  req: Request<{}, {}, DeleteMultiPickupAddressesInput>,
  res: Response,
  next: NextFunction,
) {
  try {
    const { pickupAddressIds } = req.body;

    const sessionUser = checkUser(req?.user).ok_or_throw();
    const _isAccess = await service.checkPermissions(
      sessionUser,
      OperationAction.Delete,
    );
    _isAccess.ok_or_throw();

    const _deletedPickedAddress = await service.tryDeleteMany({
      where: {
        id: {
          in: pickupAddressIds,
        },
      },
    });
    _deletedPickedAddress.ok_or_throw();

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
