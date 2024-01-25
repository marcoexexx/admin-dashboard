import { Router } from "express";
import { HttpDataResponse } from "../utils/helper";
import { generateUuid } from "../utils/generateUuid";

const router = Router()


router.route("")
  .get(async (_req, res, _next) => {
    const pk = generateUuid()

    res.status(200).json(HttpDataResponse({ pk }))
  })


export default router
