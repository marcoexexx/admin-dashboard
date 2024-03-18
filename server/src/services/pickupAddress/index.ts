import { OperationAction, Resource } from "@prisma/client";
import { db } from "../../utils/db";
import { AppService } from "../type";

/**
 * PickupAddressService class provides methods for managing pickupAddress data.
 *
 * @remarks
 * This class implements the AppService interface and is designed to handle operations related to pickup addresses.
 */
export class PickupAddressService extends AppService<
  typeof db.pickupAddress
> {
  constructor() {
    super(Resource.PickupAddress, { action: OperationAction.Read, resourceIds: [] }, db.pickupAddress);
    this.name = "PickupAddress";
  }

  /**
   * Creates a new instance of PickupAddressService.
   * @returns A new instance of PickupAddressService.
   */
  static new() {
    return new PickupAddressService();
  }
}
