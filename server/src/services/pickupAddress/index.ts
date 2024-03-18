import { OperationAction, Resource } from "@prisma/client";
import { db } from "../../utils/db";
import { AppService } from "../type";

const repository = db.pickupAddress;
/**
 * PickupAddressService class provides methods for managing pickupAddress data.
 *
 * @remarks
 * This class implements the AppService interface and is designed to handle operations related to pickup addresses.
 */
export class PickupAddressService extends AppService<
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
