import { OperationAction } from "@prisma/client";
import { NextFunction, Request, Response } from "express";
import {
  CreateTownshipInput,
  DeleteMultiTownshipsInput,
  GetTownshipInput,
  UpdateTownshipInput,
} from "../schemas/township.schema";
import { checkUser } from "../services/checkUser";
import { TownshipService } from "../services/township";
import { StatusCode } from "../utils/appError";
import { convertNumericStrings } from "../utils/convertNumber";
import { convertStringToBoolean } from "../utils/convertStringToBoolean";
import {
  HttpDataResponse,
  HttpListResponse,
  HttpResponse,
} from "../utils/helper";

const service = TownshipService.new();

export async function getTownshipsHandler(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const query = convertNumericStrings(req.query);

    const { id, name, fees } = query.filter ?? {};
    const { page, pageSize } = query.pagination ?? {};
    const { _count, userAddresses, region } =
      convertStringToBoolean(query.include) ?? {};
    const orderBy = query.orderBy ?? {};

    const sessionUser = checkUser(req?.user).ok();
    const _isAccess = await service.checkPermissions(
      sessionUser,
      OperationAction.Read,
    );
    _isAccess.ok_or_throw();

    const [count, townships] = (await service.tryFindManyWithCount(
      {
        pagination: { page, pageSize },
      },
      {
        where: { id, name, fees },
        include: { _count, userAddresses, region },
        orderBy,
      },
    )).ok_or_throw();

    res.status(StatusCode.OK).json(
      HttpListResponse(townships, count, {
        meta: {
          filter: { id, name, fees },
          include: { _count, userAddresses, region },
          page,
          pageSize,
        },
      }),
    );
  } catch (err) {
    next(err);
  }
}

export async function getTownshipHandler(
  req: Request<GetTownshipInput["params"]>,
  res: Response,
  next: NextFunction,
) {
  try {
    const query = convertNumericStrings(req.query);

    const { townshipId } = req.params;
    const { _count, userAddresses, region } =
      convertStringToBoolean(query.include) ?? {};

    const sessionUser = checkUser(req?.user).ok();
    const _isAccess = await service.checkPermissions(
      sessionUser,
      OperationAction.Read,
    );
    _isAccess.ok_or_throw();

    const township = (await service.tryFindUnique({
      where: {
        id: townshipId,
      },
      include: {
        _count,
        userAddresses,
        region,
      },
    })).ok_or_throw()!;

    if (township && sessionUser) {
      const _auditLog = await service.audit(sessionUser);
      _auditLog.ok_or_throw();
    }

    res.status(StatusCode.OK).json(
      HttpDataResponse({ township }, {
        meta: {
          id: township.id,
          include: { _count, userAddresses, region },
        },
      }),
    );
  } catch (err) {
    next(err);
  }
}

export async function createMultiTownshipsHandler(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const excelFile = req.file;

    if (!excelFile) return res.status(StatusCode.NoContent);

    const sessionUser = checkUser(req?.user).ok_or_throw();
    const _isAccess = await service.checkPermissions(
      sessionUser,
      OperationAction.Create,
    );
    _isAccess.ok_or_throw();

    const townships = (await service.tryExcelUpload(excelFile))
      .ok_or_throw();

    // Create audit log
    const _auditLog = await service.audit(sessionUser);
    _auditLog.ok_or_throw();

    res.status(StatusCode.Created).json(HttpListResponse(townships));
  } catch (err) {
    next(err);
  }
}

export async function createTownshipHandler(
  req: Request<{}, {}, CreateTownshipInput>,
  res: Response,
  next: NextFunction,
) {
  try {
    const { name, fees } = req.body;

    const sessionUser = checkUser(req?.user).ok_or_throw();
    const _isAccess = await service.checkPermissions(
      sessionUser,
      OperationAction.Create,
    );
    _isAccess.ok_or_throw();

    const township = (await service.tryCreate({
      data: { name, fees },
    })).ok_or_throw();

    // Create audit log
    const _auditLog = await service.audit(sessionUser);
    _auditLog.ok_or_throw();

    res.status(StatusCode.Created).json(
      HttpDataResponse({ township }, { meta: { id: township.id } }),
    );
  } catch (err) {
    next(err);
  }
}

export async function deleteTownshipHandler(
  req: Request<GetTownshipInput["params"]>,
  res: Response,
  next: NextFunction,
) {
  try {
    const { townshipId } = req.params;

    const sessionUser = checkUser(req?.user).ok_or_throw();
    const _isAccess = await service.checkPermissions(
      sessionUser,
      OperationAction.Delete,
    );
    _isAccess.ok_or_throw();

    const township = (await service.tryDelete({
      where: {
        id: townshipId,
      },
    })).ok_or_throw();

    // Create audit log
    const _auditLog = await service.audit(sessionUser);
    _auditLog.ok_or_throw();

    res.status(StatusCode.OK).json(
      HttpDataResponse({ township }, { meta: { id: township.id } }),
    );
  } catch (err) {
    next(err);
  }
}

export async function deleteMultilTownshipsHandler(
  req: Request<{}, {}, DeleteMultiTownshipsInput>,
  res: Response,
  next: NextFunction,
) {
  try {
    const { townshipIds } = req.body;

    const sessionUser = checkUser(req?.user).ok_or_throw();
    const _isAccess = await service.checkPermissions(
      sessionUser,
      OperationAction.Delete,
    );
    _isAccess.ok_or_throw();

    const _deleteTownshipFees = await service.tryDeleteMany({
      where: {
        id: {
          in: townshipIds,
        },
      },
    });
    _deleteTownshipFees.ok_or_throw();

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

export async function updateTownshipHandler(
  req: Request<
    UpdateTownshipInput["params"],
    {},
    UpdateTownshipInput["body"]
  >,
  res: Response,
  next: NextFunction,
) {
  try {
    const { townshipId } = req.params;
    const { name, fees } = req.body;

    const sessionUser = checkUser(req?.user).ok_or_throw();
    const _isAccess = await service.checkPermissions(
      sessionUser,
      OperationAction.Update,
    );
    _isAccess.ok_or_throw();

    const township = (await service.tryUpdate({
      where: { id: townshipId },
      data: { name, fees },
    })).ok_or_throw();

    // Create audit log
    const _auditLog = await service.audit(sessionUser);
    _auditLog.ok_or_throw();

    res.status(StatusCode.OK).json(
      HttpDataResponse({ township }, { meta: { id: township.id } }),
    );
  } catch (err) {
    next(err);
  }
}
