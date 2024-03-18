import { OperationAction, Resource } from "@prisma/client";
import { db } from "../../utils/db";
import { AppService } from "../type";

const repository = db.userAddress;
/**
 * UserAddressService class provides methods for managing user address data.
 *
 * @remarks
 * This class implements the AppService interface and is designed to handle operations related to user address.
 */
export class UserAddressService extends AppService<
  typeof repository.count,
  typeof repository.create,
  typeof repository.findMany,
  typeof repository.findUnique,
  typeof repository.findFirst,
  typeof repository.update,
  typeof repository.delete,
  typeof repository.deleteMany,
  typeof repository.upsert,
  typeof repository
> {
  constructor() {
    super(Resource.UserAddress, { action: OperationAction.Read, resourceIds: [] }, db.userAddress);
  }

  /**
   * Creates a new instance of UserAddressService.
   * @returns A new instance of UserAddressService.
   */
  static new() {
    return new UserAddressService();
  }
}
