import { OperationAction, Resource } from "@prisma/client";
import { db } from "../../utils/db";
import { AppService } from "../type";

/**
 * UserAddressService class provides methods for managing user address data.
 *
 * @remarks
 * This class implements the AppService interface and is designed to handle operations related to user address.
 */
export class UserAddressService extends AppService<
  typeof db.userAddress
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
