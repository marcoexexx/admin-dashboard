import fs from "fs";
import AppError from "../../utils/appError";
import Result, { as_result_async, Ok } from "../../utils/result";

import { OperationAction, Resource } from "@prisma/client";
import { CreateMultiExchangesInput } from "../../schemas/exchange.schema";
import { convertPrismaErrorToAppError } from "../../utils/convertPrismaErrorToAppError";
import { db } from "../../utils/db";
import { parseExcel } from "../../utils/parseExcel";
import { AppService } from "../type";

/**
 * ExchangeService class provides methods for managing exchange data.
 *
 * @remarks
 * This class implements the AppService interface and is designed to handle operations related to exchanges.
 */
export class ExchangeService extends AppService<
  typeof db.exchange
> {
  constructor() {
    super(Resource.Exchange, { action: OperationAction.Read, resourceIds: [] }, db.exchange);
    this.name = "Exchange";
  }

  /**
   * Creates a new instance of ExchangeService.
   * @returns A new instance of ExchangeService.
   */
  static new() {
    return new ExchangeService();
  }

  // Data create by uploading excel
  // Update not affected
  async tryExcelUpload(file: Express.Multer.File): Promise<
    Result<Awaited<ReturnType<typeof this.repository.upsert>>[], AppError>
  > {
    const buf = fs.readFileSync(file.path);
    const data = parseExcel(buf) as CreateMultiExchangesInput;

    const opt = as_result_async(this.repository.upsert);

    const opts = async (exchange: CreateMultiExchangesInput[number]) => {
      const result = (await opt({
        where: {
          id: exchange.id,
        },
        create: {
          id: exchange.id,
          to: exchange.to,
          from: exchange.from,
          rate: exchange.rate,
          date: exchange.date,
          shopowner: {
            connectOrCreate: {
              where: {
                name: exchange["shopownerProvider.name"],
              },
              create: {
                name: exchange["shopownerProvider.name"],
              },
            },
          },
        },
        update: {
          to: exchange.to,
          from: exchange.from,
          rate: exchange.rate,
          date: exchange.date,
          updatedAt: new Date(),
        },
      })).map_err(convertPrismaErrorToAppError);
      return result.ok_or_throw();
    };

    const result = await Promise.all(data.map(opts));

    return Ok(result);
  }
}
